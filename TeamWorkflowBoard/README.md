# Team Workflow Board

A production-ready React + TypeScript application for managing team tasks with a reusable component library.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/team-workflow-board.git
cd team-workflow-board

# Install dependencies
npm install

# Start development server
npm run dev

```

## 📁 Project Structure

```
TeamWorkflowBoard/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── board/          # Board-specific components
│   │   ├── forms/          # Form components
│   │   └── ui/             # Generic UI primitives
│   ├── hooks/              # Custom React hooks
│   ├── store/              # Zustand state management
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   ├── _tests_/            # Test files
│   ├── App.tsx             # Main application component
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles
├── ARCHITECTURE.md         # Design & technical notes
└── README.md               # This file
```

## 🏗️ Architecture Overview

### Component Hierarchy
```
App (Container)
├── Header
├── TaskFilters (Presentational)
├── BoardView (Container)
│   └── TaskCard (Presentational)
├── Modal (Presentational)
│   └── TaskForm (Container)
└── Toast (Presentational)
```

### State Management (Zustand)
- **Why Zustand**: Minimal boilerplate, simple API, excellent TypeScript support
- **State**: tasks, filters, sort, toast, migrationPerformed
- **Pattern**: Single store with actions for all state mutations

### Data Layer
- **Storage**: localStorage with versioning
- **Versioning**: Schema version tracking with migration support
- **Current Version**: 2 (converts date strings to Date objects)

### Component Design
- **Presentational**: Pure UI components (Button, Card, Modal, etc.)
- **Container**: Components managing state/logic (App, BoardView, TaskForm)
- **Benefits**: Easier testing, reusability, clear separation

## 🎯 Features

- Create, read, update, and delete tasks
- Task filtering by status and priority
- Search functionality
- Sort by date or priority
- Tag management
- Toast notifications
- Responsive design with Tailwind CSS

## ♿ Accessibility

- Full keyboard navigation support
- ARIA labels on all interactive elements
- Focus management in modals
- Screen reader friendly toast notifications
- Semantic HTML structure

## 🧪 Testing

Tests are written using Jest and React Testing Library.

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

### Test Coverage
- Core workflow: Creating and editing tasks
- UI behavior: Filters, search, status changes
- Form validation
- Modal interactions

## 📝 Known Limitations

1. **No Backend Sync**: Data stored in localStorage only
2. **No Drag and Drop**: Uses select dropdowns for status changes
3. **No Infinite Scroll**: All tasks loaded at once
4. **Single User**: No multi-user support
5. **Light Theme Only**: No dark mode support

## 🛠️ Tech Stack

- **React 18** with TypeScript
- **Vite** for build tooling
- **Zustand** for state management
- **React Hook Form** with Zod validation
- **Tailwind CSS** for styling
- **Jest** + **React Testing Library** for testing
- **date-fns** for date formatting

## 🤖 AI Assistance

**Where Used**:
1. Component structure and organization
2. TypeScript type definitions
3. Accessibility implementation patterns
4. Architecture documentation

**Changes from AI Suggestions**:
- Replaced Material UI with custom Tailwind components
- Changed from Redux to Zustand for state management
- Simplified migration logic for better maintainability

## 📄 License

MIT