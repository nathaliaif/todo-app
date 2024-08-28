const textareaAdd = document.getElementById('todo-textarea');
const btnRemoveTask = document.querySelector('todo__section-task-list__remove');
const ulTasks = document.querySelector('.todo__section-task-list');
const textItemsLeft = document.getElementById('items-left');
const btnCompleteTask = document.querySelectorAll('.todo__complete-task');


// let tasksList = JSON.parse(localStorage.getItem('tasks')) || [];
let tasksList = [];

textareaAdd.addEventListener('keydown', (event) => {
    if (event.key === 'Enter'){
        event.preventDefault();

        const todoNewTask = textareaAdd.value;
        const task = {
            id: Date.now(),
            description: todoNewTask
        }

        tasksList.push(task)
        // localStorage.setItem('tasksList', JSON.stringify(task))
        // console.log(tasksList)
        textareaAdd.value = '';

        ulTasks.append(createNewTask(task));
    }
})

// ---- Create new task ----
function createNewTask(task) {
    const li = document.createElement('li');
    li.classList.add('todo__section-task-list__li', 'todo-item', 'primary-font');
    li.setAttribute('unique-id', `${task.id}`);

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

    return li;
}

// Automatically ataches the eventListener to all present and future tasks
document.querySelector('.todo__section-task-list').addEventListener('click', function(event){
    const parentLi = event.target.closest('.todo__section-task-list__li');
    const buttonCheck = event.target.closest('.todo__complete-task');
    const buttonRemove = event.target.closest('.todo__section-task-list__remove');
    
    // Check if the click originated from an element that is or contains '.todo__complete-task' button
    if (buttonCheck){
        if (parentLi.classList.contains('complete')){
            parentLi.classList.remove('complete');
        } else {
            parentLi.classList.add('complete');
        }
    }

    if (buttonRemove){
        const taskId = parentLi.getAttribute('unique-id');
        
        parentLi.remove();
        tasksList = tasksList.filter(task => task.id !== Number(taskId));
    }
})


// If tasks already exist from previous sessions
// tasksList.forEach(task => {
//     const taskElement = createNewTask(task);
//     ulTasks.append(taskElement);
// })