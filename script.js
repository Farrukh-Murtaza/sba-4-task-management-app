

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


const addButton = document.getElementById("addBtn");
const modal = document.getElementById("modal");
const backdrop = document.getElementById("backdrop");
const closeButton = document.getElementById("closeBtn");

function toggleModal (e){
    if( modal.classList.contains("hidden")){
        modal.classList.remove("hidden");
    }else{
        modal.classList.add("hidden");
    }  
}

addButton.addEventListener("click" , toggleModal);
closeButton.addEventListener("click" , toggleModal);
backdrop.addEventListener("click" , toggleModal);