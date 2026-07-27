# Task Management Application #

It is a task management app where users add tasks via a modal form (category, task name, deadline, status) and tasks are organized into **Todo**, **In Progress**, and **Completed** columns.

## Layout
 
- **Sidebar** — navigation (Dashboard, Tasks, Analytics, Settings), collapsible on mobile via `toggleSidebar()`.
- **Topbar** — mobile menu toggle, notification icon, profile avatar.
- **Tasks** — three columns (Todo / In Progress / Completed) representing task status, styled with Tailwind (via CDN).

## File Structure
 
```
├── index.html          # Dashboard/home page
├── pages/
│   └── tasks.html       # Tasks board + Add Task modal (current page)
├── images/
│   └── profile-img.png
├── script.js            # Modal toggle logic + task submission handling
└── README.md
```

## Features
 
### Adding New Tasks
- Clicking the **+** button in the "Todo Tasks" column (`#addTaskBtn`) opens a modal with a form.
- The form collects:
  - **Category** — free text, required (e.g. "Development")
  - **Task Name** — free text, required
  - **Deadline** — date picker, required
  - **Status** — dropdown: `to-do` (default), `in-progress`, `completed`
- The `required` attribute on category, task name, and deadline blocks submission via native browser validation if any are left empty.
- On **submit**:
  1. Form values are read via the `FormData` API and converted into a plain task object
  2. A unique `id` (`Date.now()`) is added to the task
  3. The task is pushed into the `allTasks` array
  4. The array is saved to `localStorage`
  5. The board re-renders and the form resets

---
### Displaying Tasks
- Each column (`#todoList`, `#inProgressList`, `#completedList`) is a `<ul>` populated dynamically from `allTasks`.
- Every task renders as a card showing:
  - Task name
  - Category
  - Deadline
  - A status `<select>` dropdown (also used to move the task between columns)
- `renderTasks()` clears and rebuilds all three columns from `allTasks`, keyed by each task's `status`.

---
### Updating Task Status
- Changing a task's status dropdown fires `handleStatusChange`, which updates that task's `status` in `allTasks`, saves to `localStorage`, and re-renders the board — moving the card into the matching column immediately.

---
### Persistence (localStorage)
- `allTasks` is initialized on page load from `localStorage.getItem("allTasks")` (or `[]` if nothing is stored yet).
- `saveTasks()` writes the current `allTasks` array to `localStorage` as JSON any time it changes (on add or status update), so tasks survive page refreshes and browser restarts.
- Storage is scoped to the browser/origin — clearing browser data or using a different browser will not carry tasks over.

---
### Overdue Detection
- `isOverdue(task)` automatically compares a task's `deadline` against today's date (time-of-day ignored) every time the board renders.
- Tasks marked `completed` are never flagged as overdue, regardless of deadline.
- Overdue tasks get a red left border and a red "Overdue" badge next to the due date.
- This is calculated live on every render — nothing is stored — so it's always accurate to the current date.

---


## How It Works
1. Open `pages/tasks.html` in a browser (Tailwind is loaded via CDN, no build step needed).
2. Click the **+** icon in the "Todo Tasks" column to open the Add Task modal.
3. Fill in category, task name, deadline, and status (required fields).
4. Click **Save** — the task object is added to the in-memory `allTasks` array (check the browser console to see it logged).