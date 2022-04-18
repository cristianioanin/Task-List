// UI elements
const form = document.querySelector("#task-form");
const taskList = document.querySelector(".collection");
const clearBtn = document.querySelector(".clear-tasks");
const filter = document.querySelector("#filter");
const taskInput = document.querySelector("#task");
const urgentCheck = document.querySelector("#urgent");

// Event-listeners loader
loadEventListeners();

function loadEventListeners() {
    // DOM load event
    document.addEventListener("DOMContentLoaded", getTasks);
    // Add-task event
    form.addEventListener("submit", addTask);
    // Remove-task event
    taskList.addEventListener("click", removeTask);
    // Clear all-tasks event
    clearBtn.addEventListener("click", clearTasks);
    // Filter tasks event
    filter.addEventListener("keyup", filterTasks);
}

// Add simple task
// Helper function to create list element for DOM
function createListElement(input, urgent) {
    const urgentMark = document.createElement("a");
    urgentMark.innerHTML = '<i class="fa fa-exclamation"></i>';

    // Create <li> element
    const li = document.createElement("li");
    li.className = "collection-item";
    if (urgent === true || urgent.checked) {
        li.appendChild(urgentMark);
    }
    // if (urgent.checked) { urgent.removeAttribute('checked'); }
    // li.appendChild(document.createTextNode(input));
    li.insertAdjacentHTML("beforeend", input);

    // Create <a> element
    const link = document.createElement("a");
    link.className = "delete-item secondary-content";
    link.innerHTML = '<i class="fa fa-remove"></i>';
    li.appendChild(link);

    // Append list item to the <ul> element in the page
    if ((urgent === true || urgent.checked) && taskList.firstChild) {
        taskList.insertBefore(li, taskList.firstChild);
    } else {
        taskList.appendChild(li);
    }
}

function addTask(event) {
    event.preventDefault();

    // Create and append list element
    if (taskInput.value === "") {
        return alert("Add a task!");
    }
    createListElement(taskInput.value, urgentCheck);

    // Store task in local storage
    taskToLocalStorage(taskInput.value, urgentCheck);
    restoreCheckbox(urgentCheck);

    // Clear input
    taskInput.value = "";
}

// Store task to local storage
// Helper function to check local storage
function checkLocalStorage() {
    let tasksArray;
    if (localStorage.getItem("tasks") === null) {
        tasksArray = [];
    } else {
        tasksArray = JSON.parse(localStorage.getItem("tasks"));
    }

    return tasksArray;
}

function taskToLocalStorage(task, urgent) {
    let tasks = checkLocalStorage();

    tasks.push({ task: task, urgent: urgent.checked });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Get tasks from local storage
function getTasks() {
    let tasks = checkLocalStorage();

    tasks.forEach((task) => {
        createListElement(task.task, task.urgent);
    });
}

// Remove simple task from UI
function removeTask(event) {
    if (event.target.parentElement.classList.contains("delete-item")) {
        if (confirm("Are you sure you want to remove this task?")) {
            const element = event.target.parentElement.parentElement;
            element.remove();

            removeTaskFromLocalStorage(element);
        }
    }
}

// Remove simple task from local storage
function removeTaskFromLocalStorage(taskItem) {
    let tasks = checkLocalStorage();

    tasks.forEach((task, index) => {
        if (taskItem.textContent === task.task) {
            tasks.splice(index, 0);
        }
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Clear all tasks
function clearTasks() {
    const confirmation = confirm("Are you sure you want to remove all tasks?");

    while (taskList.firstChild) {
        taskList.removeChild(taskList.firstChild);
    }

    clearTasksFromLocalStorage();
}

function clearTasksFromLocalStorage() {
    localStorage.removeItem("tasks");
}

// Filter tasks
function filterTasks(event) {
    const text = event.target.value.toLowerCase();

    document.querySelectorAll(".collection-item").forEach((task) => {
        const itemTextContent =
            task.firstChild.nodeType === 1
                ? task.firstChild.nextSibling.textContent
                : task.firstChild.textContent;

        if (itemTextContent.indexOf(text) !== -1) {
            task.style.display = "block";
        } else {
            task.style.display = "none";
        }
    });
}
