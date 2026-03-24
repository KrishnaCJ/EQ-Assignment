# EQ-Assignment - Interview Projects

A collection of projects demonstrating software engineering skills.

---

## 🎯 What's Inside?

This repository has 4 projects:

1. **Team Workflow Board** - Task management app (Main Project)
2. **Booking Service** - Meeting booking backend
3. **MaxProfit** - Algorithm challenge
4. **WaterTank** - Algorithm challenge

---

## ⚡ Quick Start (5 Minutes)

### What You Need
- Node.js 18+ ([Download here](https://nodejs.org/))
- npm (comes with Node.js)

### Step 1: Get the Code
```bash
git clone https://github.com/KrishnaCJ/EQ-Assignment.git
cd EQ-Assignment
```

### Step 2: Run Team Workflow Board (Main Project)
```bash
cd TeamWorkflowBoard
npm install
npm run dev
```

Open your browser: **http://localhost:5173**

### Step 3: Run Tests
```bash
npm test -- --no-coverage
```

You should see: **6 tests passing ✅**

---

## 📁 How to Run Each Project

### 1️⃣ Team Workflow Board (React App)

**What it does:** Create, manage, and organize tasks on a Kanban board

**How to run:**
```bash
cd TeamWorkflowBoard
npm install
npm run dev
```

**What you can do:**
- Create new tasks
- Move tasks between columns (Backlog, In Progress, Done)
- Filter and search tasks
- Sort by date or priority
- Add tags to tasks

**Tests:**
```bash
npm test -- --no-coverage
```

---

### 2️⃣ Booking Service (Node.js Backend)

**What it does:** Backend service for booking meetings

**How to run:**
```bash
cd BookingService
npm install
npm start
```

**Run tests:**
```bash
npm test
```

---

### 3️⃣ MaxProfit (Algorithm)

**What it does:** Find maximum profit 

**How to run:**
```bash
cd MaxProfit
```

---

### 4️⃣ WaterTank (Algorithm)

**What it does:** Calculate water trapped in elevation map

**How to run:**
```bash
cd WaterTank
open index.html
```

Or open the file in your browser.

---

## 🎨 Team Workflow Board - Features

### What You Can Do
✅ Create tasks with title, description, priority, assignee, tags  
✅ View tasks on a Kanban board  
✅ Edit and delete tasks  
✅ Filter by status and priority  
✅ Search by title or description  
✅ Sort by date or priority  
✅ Data saves automatically  

### Technology Used
- React (UI framework)
- TypeScript (type safety)
- Zustand (state management)
- Tailwind CSS (styling)
- Jest (testing)

---

## 📚 Documentation

### For Team Workflow Board

**Want to understand the design?**
- Read: `TeamWorkflowBoard/ARCHITECTURE.md`

---

## ✅ What's Completed

### Team Workflow Board
- ✅ All features working
- ✅ 6 tests passing
- ✅ Fully responsive (mobile, tablet, desktop)
- ✅ Keyboard navigation support
- ✅ Accessibility features
- ✅ Production-ready code

### Booking Service
- ✅ Backend working
- ✅ Tests passing

### Algorithms
- ✅ MaxProfit working
- ✅ WaterTank working

---

## 🛠️ Common Commands

### Team Workflow Board
```bash
cd TeamWorkflowBoard

npm run dev              # Start development server
npm test                 # Run tests (watch mode)
npm run build            # Build for production
npm test -- --no-coverage    # Run tests once
```

### Booking Service
```bash
cd BookingService

npm start                # Start server
npm test                 # Run tests
```

---

## ❓ Troubleshooting

### Port 5173 already in use?
```bash
npm run dev -- --port 3000
```

### Tests not working?
```bash
npm test -- --clearCache
npm test -- --no-coverage
```

### Module errors?
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 📖 How to Review

1. **See it working**
   ```bash
   cd TeamWorkflowBoard
   npm install
   npm run dev
   ```

2. **Check the code**
   - Open `TeamWorkflowBoard/src/` folder
   - Look at components, hooks, and store

3. **Run the tests**
   ```bash
   npm test -- --no-coverage
   ```

4. **Read the design**
   - Open `TeamWorkflowBoard/ARCHITECTURE.md`

5. **Check git history**
   ```bash
   git log --oneline
   ```

---

## 🎓 What This Shows

- ✅ React expertise
- ✅ TypeScript skills
- ✅ Component design
- ✅ State management
- ✅ Testing practices
- ✅ Accessibility awareness
- ✅ Performance optimization
- ✅ Professional code quality

---

## 📞 Need Help?

**For Team Workflow Board:**
1. Check `ARCHITECTURE.md` for design decisions
2. Look at test files for usage examples

**For other projects:**
1. Check project README files
2. Look at the code comments

---

## 🔗 Links

- **GitHub:** https://github.com/KrishnaCJ/EQ-Assignment
- **Main Project:** TeamWorkflowBoard/
- **Dev Server:** http://localhost:5173

---

## 📊 Quick Reference

| Project | Type | How to Run | Status |
|---------|------|-----------|--------|
| Team Workflow Board | React App | `npm run dev` | ✅ Complete |
| Booking Service | Node Backend | `npm start` | ✅ Complete |
| MaxProfit | Algorithm | `node maxProfit.js` | ✅ Complete |
| WaterTank | Algorithm | `open index.html` | ✅ Complete |

---

**Status:** ✅ Complete & Ready for Review

**Last Updated:** March 24, 2026
