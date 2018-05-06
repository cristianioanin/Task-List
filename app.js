// UI elements
const form = document.querySelector('#task-form');
const taskList = document.querySelector('.collection');
const clearBtn = document.querySelector('.clear-tasks');
const filter = document.querySelector('#filter');
const taskInput = document.querySelector('#task');

// Event-listeners loader
loadEventListeners();

function loadEventListeners() {
    // DOM load event
    document.addEventListener('DOMContentLoaded', getTasks);
    // Add-task event
    form.addEventListener('submit', addTask);
    // Remove-task event
    taskList.addEventListener('click', removeTask);
    // Clear all-tasks event
    clearBtn.addEventListener('click', clearTasks);
    // Filter tasks event
    filter.addEventListener('keyup', filterTasks);
}

// Add simple task
// Helper function to create list element for DOM
function createListElement(input) {
        // Create <li> element
        const li = document.createElement('li');
        li.className = 'collection-item';
        li.appendChild(document.createTextNode(input));
    
        // Create <a> element
        const link = document.createElement('a');
        link.className = 'delete-item secondary-content';
        link.innerHTML = '<i class="fa fa-remove"></i>';
        li.appendChild(link);
    
        // Append list item to the <ul> element in the page
        taskList.appendChild(li);
}

function addTask(event) {
    event.preventDefault();

    // Create and append list element
    if (taskInput.value === '') alert('Add a task!');
    createListElement(taskInput.value);

    // Store task in local storage
    taskToLocalStorage(taskInput.value);

    // Clear input
    taskInput.value = '';
}

// Store task to local storage
// Helper function to check local storage
function checkLocalStorage() {
    let tasksArray;
    if (localStorage.getItem('tasks') === null) {
        tasksArray = [];
    } else {
        tasksArray = JSON.parse(localStorage.getItem('tasks'));
    }

    return tasksArray;
}

function taskToLocalStorage(task) {
    let tasks = checkLocalStorage();

    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Get tasks from local storage
function getTasks() {
    let tasks = checkLocalStorage();

    tasks.forEach(task => {
        createListElement(task);
    });
}


// Remove simple task from UI
function removeTask(event) {
    if (event.target.parentElement.classList.contains('delete-item')) {
        if (confirm('Are you sure you want to remove this task?')) {
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
        if (taskItem.textContent === task) {
            tasks.splice(index, 1);
        }
    });

    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Clear all tasks
function clearTasks() {
    if (confirm('Are you sure you want to remove all tasks?')) {
        // taskList.innerHTML = '';

        // A faster solution
        while (taskList.firstChild) {
            taskList.removeChild(taskList.firstChild);
        }
        clearTasksFromLocalStorage();
    }
}

function clearTasksFromLocalStorage() {
    localStorage.removeItem('tasks');
}

// Filter tasks
function filterTasks(event) {
    const text = event.target.value.toLowerCase();

    document.querySelectorAll('.collection-item').forEach(task => {
        const item = task.firstChild.textContent;
        if (item.toLowerCase().indexOf(text) !== -1) {
            task.style.display = 'block';
        } else {
            task.style.display = 'none';
        }
    });
}