# Task Management Application #

It is a task management app where users add tasks via a modal form (category, task name, deadline, status) and tasks are organized into **Todo**, **In Progress**, and **Completed** columns.

## Layout
 
- **Sidebar** — navigation (Dashboard, Tasks, Analytics, Settings), collapsible on mobile via `toggleSidebar()`.
- **Topbar** — mobile menu toggle, notification icon, profile avatar.
- **Tasks** — three columns (Todo / In Progress / Completed) representing task status, styled with Tailwind (via CDN).
- **Filter bar** — category and status dropdowns, plus "Clear filters".

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
### Filtering
- A filter bar sits above the board with two dropdowns:
  - **Category** — dynamically populated from the distinct categories currently in `allTasks` (plus "All categories")
  - **Status** — fixed options: All statuses / To do / In progress / Completed
- A **Clear filters** button resets both back to "All".
- `getFilteredTasks()` combines both filters with AND logic (e.g. category "Work" + status "Completed" shows only completed Work tasks) and feeds the result into `renderTasks()`.
- Filtering by status will naturally empty out non-matching columns, since the board is already split by status; the category filter narrows what's shown within whichever columns remain visible.

---
## How It Works
1. Open `pages/tasks.html` in a browser (Tailwind loads via CDN, no build step needed).
2. Click the **+** icon in the "Todo Tasks" column to open the Add Task modal.
3. Fill in category, task name, deadline, and status, then click **Save**.
4. The task appears as a card in the matching column, is saved to `localStorage`, and is automatically flagged "Overdue" if its deadline has passed.
5. Change a task's status via its dropdown to move it between columns — the change persists across reloads.

## Reflection
Building this project taught me a lot about keeping UI and data in sync. The trickiest part was making sure the task list, the DOM, and `localStorage` always synced with each other. I also ran into a quiet bug where my status dropdown values ("In progress", "Completed") didn't match the lowercase keys I used to sort tasks into columns, so tasks just disappeared with no error to point me to why.

I learned to fix both by leaning on one main `renderTasks()` function that always rebuilds the whole board from scratch off the current task array, instead of trying to update pieces of the DOM individually. For the silent bug, `console.log` became my best friend for tracing exactly where the data stopped matching up, which taught me to be a lot more careful about keeping values consistent across a whole project.

If I had more time, I'd add editing and deleting tasks, better input validation, and eventually move storage to a real backend instead of `localStorage`.