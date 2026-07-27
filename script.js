

 function toggleSidebar(open) {
    const sidebar = document.getElementById('sidebar');
    const backdrop = document.getElementById('sidebarBackdrop');
    if (open) {
      sidebar.classList.remove('-translate-x-full');
      backdrop.classList.remove('hidden');
      document.body.classList.add('overflow-hidden');
    } else {
      sidebar.classList.add('-translate-x-full');
      backdrop.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    }
  }
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) toggleSidebar(false);
  });


    // 1. Adding New Tasks
    // Create input fields for the task name, category, deadline, and an initial status (e.g., “In Progress”).
    // Include an “Add Task” button that will add the task to the task list.
    // Each task should be stored as an object with properties such as task name, category, deadline, and status.
    // Add the task object to an array that holds all tasks.


    const addButton = document.getElementById("addTaskBtn");
    const modal = document.getElementById("modal");
    const backdrop = document.getElementById("backdrop");
    const closeButton = document.getElementById("closeBtn");
    const taskForm = document.getElementById("taskForm");

    // filters
    const categoryFilter = document.getElementById("categoryFilter");
    const statusFilter = document.getElementById("statusFilter");
    const clearFiltersBtn = document.getElementById("clearFilters");


    const columnMap = {
        "to-do": document.getElementById("todoList"),
        "in-progress": document.getElementById("inProgressList"),
        "completed": document.getElementById("completedList")
    };

        // check if allTask exist in localStorage
    // if its null create a key allTask with and empty array 
    let allTasks = JSON.parse(localStorage.getItem("allTasks")) || [];


    function toggleModal (e){
        if( modal.classList.contains("hidden")){
            modal.classList.remove("hidden");
        }else{
            modal.classList.add("hidden");
        }  
    }


    function saveTasks() {
        localStorage.setItem("allTasks", JSON.stringify(allTasks));
    }


      function renderTasks() {

        populateCategoryFilter();
       
        Object.values(columnMap).forEach(list => list.innerHTML = "");
        const tasksToRender = getFilteredTasks();

         tasksToRender.forEach(task => {
            const column = columnMap[task.status];
            if (column) column.appendChild(createTaskCard(task));
        });
    }


    // handle the status change
    function handleStatusChange(e) {
        const id = Number(e.target.dataset.id);
        const task = allTasks.find(t => t.id === id);
        if (task) {
            task.status = e.target.value;
            saveTasks();
            renderTasks();
        }
    }


    // handle overdue tasks
    function isOverdue(task) {
        if (task.status === "completed") return false;
        if (!task.deadline) return false;

        const today = new Date();
        today.setHours(0, 0, 0, 0); // strip time so it's a pure date comparison

        const deadlineDate = new Date(task.deadline);
        deadlineDate.setHours(0, 0, 0, 0);

        return deadlineDate < today;
    }


    function createTaskCard(task) {
        const li = document.createElement("li");
        li.className = "bg-white rounded-lg p-3 shadow-sm";

         const overdue = isOverdue(task);

        // red left border as a visual cue when overdue
        if (overdue) {
            li.classList.add("border-l-4", "border-red-500");
        }

        const name = document.createElement("p");
        name.className = "font-medium text-gray-800 text-sm";
        name.textContent = task.taskName;

        const category = document.createElement("p");
        category.className = "text-xs text-gray-500 mt-1";
        category.textContent = task.category;

        const deadlineRow = document.createElement("div");
        deadlineRow.className = "flex items-center gap-2";

        const deadline = document.createElement("p");
        deadline.className = "text-xs text-gray-500";
        deadline.textContent = `Due: ${task.deadline}`;
        deadlineRow.appendChild(deadline);

        // "Overdue" badge, shown automatically based on today's date
        if (overdue) {
            const badge = document.createElement("span");
            badge.className = "text-[10px] font-semibold text-red-600 bg-red-50 px-1.5 py-0.5 rounded";
            badge.textContent = "Overdue";
            deadlineRow.appendChild(badge);
        }

        const statusSelect = document.createElement("select");
        statusSelect.className = "mt-2 text-xs border border-gray-200 rounded p-1";
        statusSelect.dataset.id = task.id;
        statusSelect.innerHTML = `
            <option value="to-do">To do</option>
            <option value="in-progress">In progress</option>
            <option value="completed">Completed</option>
        `;
        statusSelect.value = task.status;
        statusSelect.addEventListener("change", handleStatusChange);

        li.append(name, category, deadline, statusSelect);
        return li;
    }


    function populateCategoryFilter() {
        const previousValue = categoryFilter.value;
        const categories = [...new Set(allTasks.map(t => t.category).filter(Boolean))];

        
        categoryFilter.innerHTML = `<option value="all">All categories</option>` +
            categories.map(cat => `<option value="${cat}">${cat}</option>`).join("");

            console.log(categoryFilter);
        // keep the previously selected filter if it still exists, otherwise reset to "all"
        categoryFilter.value = categories.includes(previousValue) ? previousValue : "all";
    }

    function getFilteredTasks() {
        const categoryValue = categoryFilter.value;
        const statusValue = statusFilter.value;

        return allTasks.filter(task => {
            const matchesCategory = categoryValue === "all" || task.category === categoryValue;
            const matchesStatus = statusValue === "all" || task.status === statusValue;
            return matchesCategory && matchesStatus;
        });
    }


    function handleSubmit (e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        data.id = Date.now(); // giving id generated from data
        allTasks.push(data);
        saveTasks();

        e.target.reset();
         renderTasks();
         toggleModal();
    }


    addButton.addEventListener("click" , toggleModal);
    closeButton.addEventListener("click" , toggleModal);
    backdrop.addEventListener("click" , toggleModal);
    taskForm.addEventListener("submit", handleSubmit)


    categoryFilter.addEventListener("change", renderTasks);
    statusFilter.addEventListener("change", renderTasks);

    // reset both filters back to "all"
    clearFiltersBtn.addEventListener("click", () => {
        categoryFilter.value = "all";
        statusFilter.value = "all";
        renderTasks();
    });

    renderTasks();