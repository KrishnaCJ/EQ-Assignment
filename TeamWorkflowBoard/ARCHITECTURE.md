# Team Workflow Board - Architecture & Technical Notes

## Component Hierarchy

```
App (Container)
├── Header
│   └── Create Task Button
├── TaskFilters (Presentational)
├── BoardView (Container)
│   ├── Column (Backlog, In Progress, Done)
│   │   └── TaskCard (Presentational)
│   │       ├── Priority Badge
│   │       ├── Tags
│   │       └── Status Select
├── Modal (Presentational)
│   └── TaskForm (Container)
│       ├── Title Input
│       ├── Description Input
│       ├── Status Select
│       ├── Priority Select
│       ├── Assignee Input
│       └── Tags Array
└── Toast (Presentational)
```

## State Management

**Library**: Zustand

**Rationale**:
- Minimal boilerplate compared to Redux
- Simple API for global state
- Built-in middleware support
- Good TypeScript integration
- Perfect for this app's state complexity

**State Structure**:
- `tasks`: Array of task objects
- `filters`: Current filter state (statuses, priorities, search)
- `sort`: Current sort configuration
- `toast`: Active notification message
- `migrationPerformed`: Flag for data migration

## Data Layer

**Storage**: localStorage with versioning

**Versioning Approach**:
- Schema version stored alongside data
- Migration function handles version upgrades
- Current version: 2

**Migration v1 → v2**:
- Converts date strings to Date objects
- Ensures tags is always an array
- Prevents data corruption on app updates

## Component Design

**Presentational vs Container Pattern**:
- **Presentational**: Pure UI components (Button, Card, Modal, Toast, etc.)
- **Container**: Components that manage state/logic (App, BoardView, TaskForm)

**Benefits**:
- Easier testing (pure functions)
- Reusability across different contexts
- Clear separation of concerns

## Accessibility Features

1. **Keyboard Navigation**:
   - Tab order maintained via semantic HTML
   - Modal has Escape key handler
   - Focus trapping within modals

2. **Screen Reader Support**:
   - All inputs have associated labels
   - ARIA attributes on interactive elements
   - Toast notifications use `role="alert"`

3. **Focus Management**:
   - First focusable element focused on modal open
   - Close button has explicit aria-label

## Performance Optimizations

**Issue Found & Fixed**: Unnecessary re-renders on filter changes

**Solution**:
- Zustand's selective subscription prevents re-renders on unrelated state changes
- Filtered tasks computed in a memoized selector pattern
- TaskCard components only re-render when their specific task changes

**React DevTools Verification**:
- Used React DevTools Profiler to identify re-renders
- Confirmed only affected components re-render on state changes

## Known Limitations & Trade-offs

1. **No Drag and Drop**: Implemented with select dropdowns instead for simplicity
2. **Single User**: No backend sync - localStorage only
3. **No Infinite Scroll**: All tasks loaded at once (fine for <1000 tasks)
4. **No Server-side Rendering**: Client-side only for simplicity
5. **No Dark Mode**: Light theme only

## Example Refactor

**Original Code**:
```typescript
// TaskCard had inline filter/sort logic
const filteredTasks = tasks.filter(...).sort(...)
```

**Refactored**:
```typescript
// Moved to BoardView with memoization
const getFilteredAndSortedTasks = useMemo(() => {
  // filter and sort logic
}, [tasks, filters, sort])
```

**Why**: Reduced redundant computations and improved performance

## AI Assistance

**Where Used**:
1. **Component Structure**: AI suggested the container/presentational pattern
2. **TypeScript Types**: AI helped define strict types for Task interface
3. **Accessibility**: AI suggested ARIA attributes and keyboard navigation patterns

**Changes Made**:
- Removed AI's suggestion for Material UI components (used custom Tailwind components instead)
- Modified state management approach from Redux to Zustand
- Simplified the migration logic for better maintainability
