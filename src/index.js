import './index.css';
import TodoApp from './modules/crud.js';

const todoListBox = document.getElementById('todo-list-box');
const todoApp = new TodoApp(todoListBox);

const clearCompletedButton = document.getElementById('clear-completed-button');
clearCompletedButton.addEventListener('click', () => todoApp.clearAllCompletedTasks());

todoApp.render();
