const textareaAdd = document.getElementById('todo-textarea');
const ulTasks = document.querySelector('.todo__section-task-list');
const textItemsLeft = document.getElementById('items-left');

const btnRemoveTask = document.querySelector('todo__section-task-list__remove');
const btnCompleteTask = document.querySelectorAll('.todo__complete-task');
const btnClearCompleted = document.getElementById('clear-completed');

const filters = document.querySelectorAll('input[type=radio]')

let tasksList = [];
updateTasks(JSON.parse(localStorage.getItem('tasks')));

function updateTasks(newTaskList){
    if (!newTaskList){
        return;
    }

    localStorage.setItem('tasks', JSON.stringify(newTaskList));
    tasksList = newTaskList;

    updateItemsLeft();
    createTaskListElement(newTaskList);
}

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
            
            textareaAdd.value = '';
            updateTasks([...tasksList, task]);
            // TODO: Update localstorage
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

}

// ---- Create new individual task item element ----
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

    li.addEventListener('dragstart', () => {
        li.classList.add('dragging');
    })
    
    li.addEventListener('dragend', () => {
        li.classList.remove('dragging');
        const cloneTaskList = [...tasksList];
        
        const draggingUniqueId = li.getAttribute('unique-id');
        const draggingIndex = cloneTaskList.findIndex(item => item.id === draggingUniqueId);
        const draggingObject = cloneTaskList.find(item => item.id === draggingUniqueId);
        
        let afterElementIndex = -1;
        if (afterElement){
            const afterElementUniqueId = afterElement.getAttribute('unique-id');
            afterElementIndex = cloneTaskList.findIndex(item => item.id === afterElementUniqueId);
        } else {
            afterElementIndex = cloneTaskList.length;
        }

        //Reorder tasksList array
        if (draggingIndex !== -1){
            cloneTaskList.splice(draggingIndex, 1);

            const newIndex = afterElementIndex;
            cloneTaskList.splice(newIndex, 0, draggingObject);
        } else {
            cloneTaskList.push(draggingObject);
        }
        updateTasks(cloneTaskList);
    })
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
    let cloneTaskList = [...tasksList];
    const listItem = cloneTaskList.find(item => item.id === taskId);

    console.log("click", {event, parentLi, buttonCheck, buttonRemove, editTaskName})
    
    if (buttonCheck){
        if (parentLi.classList.contains('complete')){
            parentLi.classList.remove('complete');
            listItem.complete = false;

        } else {
            parentLi.classList.add('complete');
            listItem.complete = true;
        }
        updateTasks(cloneTaskList);
        console.log(tasksList);
    }

    // If it's the remove button
    if (buttonRemove){
        parentLi.remove();

        updateTasks(tasksList.filter(task => task.id !== taskId));
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
})


// ---- Filters ----

// Update the 'items left' counter
function updateItemsLeft(){
    textItemsLeft.textContent = tasksList.filter(item => !item.complete).length;
}


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

            updateTasks(tasksList.filter(item => item.id !== elementId));
        } else {
            return;
        }
    })
})


// ---- Drag and Drop ----
const container = document.querySelector('.todo__section-task-list');
let afterElement;

container.addEventListener('dragover', e => {
        e.preventDefault();
        afterElement = getDragAfterElement(container, e.clientY);
        const draggable = document.querySelector('.dragging');

        if (!afterElement){ 
            container.appendChild(draggable);
        } else {
            container.insertBefore(draggable, afterElement);
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