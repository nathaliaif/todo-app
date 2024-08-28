const textareaAdd = document.getElementById('todo-textarea');
const ulTasks = document.querySelector('.todo__section-task-list');
const textItemsLeft = document.getElementById('items-left');

const btnRemoveTask = document.querySelector('todo__section-task-list__remove');
const btnCompleteTask = document.querySelectorAll('.todo__complete-task');
// const btnFilterAll = document.getElementById('filter-all');
// const btnFilterActive = document.getElementById('filter-active');
// const btnFilterCompleted = document.getElementById('filter-completed');
const btnClearCompleted = document.getElementById('clear-completed');

// TODO: Clear completed

// let tasksList = JSON.parse(localStorage.getItem('tasks')) || [];
let tasksList = [];

textareaAdd.addEventListener('keydown', (event) => {
    if (event.key === 'Enter'){
        event.preventDefault();
        
        const todoNewTask = textareaAdd.value;
        const task = {
            id: Date.now().toString(),
            description: todoNewTask,
            complete: false
        }
        
        tasksList.push(task);
        // localStorage.setItem('tasksList', JSON.stringify(task))
        // console.log(tasksList)
        textareaAdd.value = '';
        
        // ulTasks.append(createNewTask(task));
        createTaskListElement(tasksList);
        // TODO: not allow empty space
        // TODO: Update localstorage
        // TODO: Set filter as All
    }
})

function createTaskListElement(tasks) {
    // if (!tasks.length) return;

    console.log("createTaskListElement", { tasks });

    const oldTasks = document.querySelectorAll('.todo__section-task-list__li');
    oldTasks.forEach(item => item.remove());

    tasks.forEach(item => {
        ulTasks.append(createNewTask(item));
    })
}

// ---- Create new task ----
function createNewTask(task) {
    const li = document.createElement('li');
    li.classList.add('todo__section-task-list__li', 'todo-item', 'primary-font');
    li.setAttribute('unique-id', `${task.id}`);

    if (task.complete){
        li.classList.add('complete');
    }

    const buttonComplete = document.createElement('button');
    buttonComplete.classList.add('todo__complete-task', 'todo__icon');
    
    const buttonCheckImg = document.createElement('img');
    buttonCheckImg.setAttribute('src', 'images/icon-check.svg');
    buttonCheckImg.classList.add('todo__completed-icon')
    buttonComplete.append(buttonCheckImg);

    const p = document.createElement('p');
    p.classList.add('todo__section-task-list__description');
    p.textContent = task.description;

    const svg = document.createElement('svg');
    svg.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg">
              <path fill="currentColor" fill-rule="evenodd" d="M16.97 0l.708.707L9.546 8.84l8.132 8.132-.707.707-8.132-8.132-8.132 8.132L0 16.97l8.132-8.132L0 .707.707 0 8.84 8.132 16.971 0z"/>
            </svg>`

    const button = document.createElement('button');
    button.classList.add('todo__section-task-list__remove', 'primary-font');
    button.append(svg);

    li.append(buttonComplete);
    li.append(p);
    li.append(button);

    updateItemsLeft();
    return li;
}

// Automatically ataches the eventListener to all present and future tasks
document.querySelector('.todo__section-task-list').addEventListener('click', function(event){
    const parentLi = event.target.closest('.todo__section-task-list__li');
    const buttonCheck = event.target.closest('.todo__complete-task');
    const buttonRemove = event.target.closest('.todo__section-task-list__remove');
    const taskId = parentLi.getAttribute('unique-id');
    const listItem = tasksList.find(item => item.id === taskId);
    
    // Check if the click originated from a check button
    if (buttonCheck){
        if (parentLi.classList.contains('complete')){
            parentLi.classList.remove('complete');
            listItem.complete = false;
            
        } else {
            parentLi.classList.add('complete');
            listItem.complete = true;
        }
    }

    // Check if the click originated from a remove button
    if (buttonRemove){
        parentLi.remove();
        tasksList = tasksList.filter(task => task.id !== taskId);
    }
    updateItemsLeft();
})


// If tasks already exist from previous sessions
// tasksList.forEach(task => {
//     const taskElement = createNewTask(task);
//     ulTasks.append(taskElement);
// })

// ---- Filters ----
function updateItemsLeft(){
    textItemsLeft.textContent = tasksList.filter(item => !item.complete).length;
}

updateItemsLeft();

const filters = document.querySelectorAll('input[type=radio]')

filters.forEach(element => element.addEventListener("click", (e) => {
    createTaskListElement(filterTaskList(e.target.value));
}))

// btnFilterAll.addEventListener('click', () => {
//     createTaskListElement(filterTaskList('all'));
//     btnFilterAll.focus();
// })

// btnFilterActive.addEventListener('click', () => {
//     createTaskListElement(filterTaskList('active'));  
// })

// btnFilterCompleted.addEventListener('click', () => {
//     createTaskListElement(filterTaskList('completed'))
//     btnFilterCompleted.focus();
// })

function filterTaskList(filter) {
    let filteredTasks = null;
    
    switch(filter){
        case 'all':
            filteredTasks = tasksList;
            break;
        case 'active':
            filteredTasks = tasksList.filter(task => !task.complete);
            break;
        case 'completed':
            filteredTasks = tasksList.filter(task => task.complete);
            break;
        default:
            break;
    }

    return filteredTasks

    // filteredTasks.forEach(task => {
    //     const taskElement = createNewTask(task);
    //     ulTasks.append(taskElement);
    // })
}