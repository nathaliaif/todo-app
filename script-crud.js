const textareaAdd = document.getElementById('todo-textarea');
const btnRemoveTask = document.querySelector('todo__section-task-list__remove');
const ulTasks = document.querySelector('.todo__section-task-list');
const textItemsLeft = document.getElementById('items-left');

// let tasksList = JSON.parse(localStorage.getItem('tasks')) || [];
let tasksList = [];

textareaAdd.addEventListener('keydown', (event) => {
    if (event.key === 'Enter'){
        event.preventDefault();

        const todoNewTask = textareaAdd.value;
        const task = {
            description: todoNewTask
        }

        tasksList.push(task)
        // localStorage.setItem('tasksList', JSON.stringify(task))
        console.log(tasksList)
        textareaAdd.value = '';

        ulTasks.append(createNewTask(todoNewTask));
    }
})

function createNewTask(task) {
    const li = document.createElement('li');
    li.classList.add('todo__section-task-list__li', 'todo-item', 'primary-font');

    const div = document.createElement('div');
    div.classList.add('todo__icon');
    
    const p = document.createElement('p');
    p.classList.add('todo__section-task-list__description');
    p.textContent = task;

    const svg = document.createElement('svg');
    svg.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg">
              <path fill="currentColor" fill-rule="evenodd" d="M16.97 0l.708.707L9.546 8.84l8.132 8.132-.707.707-8.132-8.132-8.132 8.132L0 16.97l8.132-8.132L0 .707.707 0 8.84 8.132 16.971 0z"/>
            </svg>`

    const button = document.createElement('button');
    button.classList.add('todo__section-task-list__remove', 'primary-font');
    button.append(svg);

    li.append(div);
    li.append(p);
    li.append(button);

    return li;
}

// If tasks already exist from previous sessions
// tasksList.forEach(task => {
//     const taskElement = createNewTask(task);
//     ulTasks.append(taskElement);
// })