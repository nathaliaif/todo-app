const textareaAdd = document.getElementById('todo-textarea');
const ulTasks = document.querySelector('.todo__section-task-list');
const textItemsLeft = document.getElementById('items-left');

const btnRemoveTask = document.querySelector('todo__section-task-list__remove');
const btnCompleteTask = document.querySelectorAll('.todo__complete-task');
const btnClearCompleted = document.getElementById('clear-completed');

// TODO: Clear completed

// let tasksList = JSON.parse(localStorage.getItem('tasks')) || [];
let tasksList = [];

textareaAdd.addEventListener('keydown', (event) => {
    if (event.key === 'Enter'){
        event.preventDefault();
        const todoNewTask = textareaAdd.value.trim();
        
        if (todoNewTask.length !== 0){
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
        } else {
            return;
        }
    }
})

function createTaskListElement(tasks) {
    // if (!tasks.length) return;
    // console.log("createTaskListElement", { tasks });
    const oldTasks = document.querySelectorAll('.todo__section-task-list__li');
    oldTasks.forEach(item => item.remove());

    tasks.forEach(item => {
        ulTasks.append(createNewTask(item));
    })

    updateDragAndDrop();
}

// ---- Create new task item element ----
function createNewTask(task) {
    const li = document.createElement('li');
    li.classList.add('todo__section-task-list__li', 'todo-item', 'primary-font');
    li.setAttribute('unique-id', `${task.id}`);
    li.setAttribute('draggable', 'true');

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
    // p.setAttribute('contenteditable', 'true');
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

const BUTTON_CHECK = '.todo__complete-task'
const ACTION_BUTTONS = {
    CHECK: '.todo__complete-task',
    EDIT: '.todo__section-task-list__description',
    REMOVE: '.todo__section-task-list__remove'
}

// Automatically attaches the eventListener to all present and future tasks
document.querySelector('.todo__section-task-list').addEventListener('click', function(event){
    const parentLi = event.target.closest('.todo__section-task-list__li');
    const buttonCheck = event.target.closest('.todo__complete-task');
    const buttonRemove = event.target.closest('.todo__section-task-list__remove');
    const editTaskName = event.target.closest('.todo__section-task-list__description');
    const taskId = parentLi.getAttribute('unique-id');
    const listItem = tasksList.find(item => item.id === taskId);

    console.log("click", {event, parentLi, buttonCheck, buttonRemove, editTaskName})
    
    if (buttonCheck){
        if (parentLi.classList.contains('complete')){
            parentLi.classList.remove('complete');
            listItem.complete = false;
        } else {
            parentLi.classList.add('complete');
            listItem.complete = true;
        }
    }

    // If it's the remove button
    if (buttonRemove){
        parentLi.remove();
        tasksList = tasksList.filter(task => task.id !== taskId);
    }

    function handleClickOutside(event){
        if (event.target !== editTaskName){
            console.log('oi')
        }
    }
    // If the click is on the task name
    // if (editTaskName){
    //     editTaskName.addEventListener('keydown', function(event){
    //         if (event.key === 'Enter'){
    //             event.preventDefault();
    //             editTaskName.blur();
                
    //             const newValue = editTaskName.textContent.trim();
    //             // Updating the array
    //             if (newValue.length === 0){
    //                 return;
    //             } else {
    //                 listItem.description = newValue;
    //             }
    //         }
    //     })
        // window.addEventListener('click', handleClickOutside)

    // }

    // window.removeEventListener('click', handleClickOutside);
    updateItemsLeft();
})


// ---- Filters ----

// Update the 'items left' counter
function updateItemsLeft(){
    textItemsLeft.textContent = tasksList.filter(item => !item.complete).length;
}

updateItemsLeft();

const filters = document.querySelectorAll('input[type=radio]')

// Will check which filter radio button was selected 
filters.forEach(element => element.addEventListener("click", (e) => {
    createTaskListElement(filterTaskList(e.target.value));
}))

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
}

// Clear completed tasks
btnClearCompleted.addEventListener('click', () => {
    tasksList.forEach(element => {
        const elementId = element.id.toString();
        const taskDOM = document.querySelector(`[unique-id="${elementId}"]`);
        const isElementCompleted = element.complete;

        if (isElementCompleted){
            taskDOM.remove();
            tasksList = tasksList.filter(item => item.id !== elementId);
        } else {
            return;
        }
    })
})


// ---- Drag and Drop ----
const container = document.querySelector('.todo__section-task-list');

function updateDragAndDrop(){
    const draggables = document.querySelectorAll('.todo__section-task-list__li');

     draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', () => {
            draggable.classList.add('dragging');
        })
    
        draggable.addEventListener('dragend', () => {
            draggable.classList.remove('dragging');
        })
    })
}

container.addEventListener('dragover', e => {
        e.preventDefault();
        const afterElement = getDragAfterElement(container, e.clientY);
        const dragging = document.querySelector('.dragging');

        const draggingUniqueId = dragging.getAttribute('unique-id');
        const draggingIndex = tasksList.findIndex(item => item.id === draggingUniqueId);
        const draggingObject = tasksList.find(item => item.id === draggingUniqueId);

        let afterElementIndex = -1;
        if (afterElement){
            const afterElementUniqueId = afterElement.getAttribute('unique-id');
            afterElementIndex = tasksList.findIndex(item => item.id === afterElementUniqueId);
            container.insertBefore(dragging, afterElement);
        } else {
            container.appendChild(dragging);
        }

        //Reorder tasksList array
        if (draggingIndex !== -1){
            tasksList.splice(draggingIndex, 1);

            const newIndex = afterElementIndex - 1;
            tasksList.splice(newIndex, 0, draggingObject);
            console.log(tasksList)
        } else {
            tasksList.push(draggingObject);
            console.log(tasksList)
        }

})

//Determine the order of our elements, based on where the mouse is
function getDragAfterElement(container, y){

// Gets every element that we're not currently dragging
const draggableElements = [...container.querySelectorAll('[draggable="true"]:not(.dragging)')];

return draggableElements.reduce((closest, child) => {

    const box = child.getBoundingClientRect(); // Gets the rectangle of our box
    const offset = y - box.top - box.height / 2; // distance between the center of the box and mouse
    // When we're below an element, our numbers are positive
    // Above the element, our numbers are negative
    
    // Checks which element our draggable element is above
    if (offset < 0 && offset > closest.offset){
        return { offset: offset, element: child };
    } else {        
        return closest;
    }
}, { offset: Number.NEGATIVE_INFINITY }).element;
// Will return which element the mouse position is directly after
}