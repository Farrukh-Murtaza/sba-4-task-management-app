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

## How It Works
 
1. Open `pages/tasks.html` in a browser (Tailwind is loaded via CDN, no build step needed).
2. Click the **+** icon in the "Todo Tasks" column to open the Add Task modal.
3. Fill in category, task name, deadline, and status (required fields).
4. Click **Save** — the task object is added to the in-memory `allTasks` array (check the browser console to see it logged).