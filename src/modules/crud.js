import { updateCompletionStatus, clearAllCompleted } from './status.js';
// Class to create a Todo App.
class TodoApp {
  // Constructs the Todo App, fetch tasks from local storage and set up event listeners.
  constructor() {
    this.inputField = document.getElementById('input');
    this.returnIcon = document.getElementById('return-icon');
    this.todoTask = JSON.parse(localStorage.getItem('todoTasks')) || [];
    this.todoListBox = document.getElementById('todo-list-box');
    this.render();
    this.AddTaskPressEnter();
    this.AddTaskPressIcon();
    this.DeleteTaskButton();
  }

  // Set an event listener for deleting a task when a specific element is clicked
  DeleteTaskButton() {
    this.todoListBox.addEventListener('mousedown', (e) => {
      if (e.target.closest('.trash-icon')) {
        this.deleteTask(e.target.dataset.task);
      }
    });
  }

  // Set an event listener for adding a task when return button is clicked
  AddTaskPressIcon() {
    this.returnIcon.addEventListener('click', (e) => {
      this.addTask(this.inputField.value);
      this.inputField.value = '';
      e.preventDefault();
    });
  }

  // Set an event listener for adding task when enter button is pressed
  AddTaskPressEnter() {
    this.inputField.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.addTask(this.inputField.value);
        this.inputField.value = '';
      }
    });
  }

  // Sorts the tasks based on their index
  sortTasks() {
    this.todoTask.sort((a, b) => a.index - b.index);
  }

  // Refreshes the tasks presented in the UI
  render() {
    this.sortTasks();
    this.todoListBox.innerHTML = '';

    this.todoTask.forEach((task, i) => {
      const todoTaskElement = document.createElement('li');
      todoTaskElement.classList.add('todo-task-container');

      const todoTaskContent = document.createElement('div');
      todoTaskContent.classList.add('task');

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = task.completed;

      checkbox.addEventListener('change', () => {
        this.todoTask = updateCompletionStatus(
          i,
          checkbox.checked,
          this.todoTask,
        );
        this.updateLocalStorage();
      });

      todoTaskContent.appendChild(checkbox);

      const description = document.createElement('span');
      description.classList.add('description');
      description.contentEditable = 'true';
      description.textContent = task.description;
      description.addEventListener('input', () => {
        this.editTask(i, description.textContent);
      });
      todoTaskContent.appendChild(description);

      const deleteIcon = document.createElement('span');
      deleteIcon.innerHTML = 'delete';
      deleteIcon.classList.add('material-icons', 'trash-icon');
      deleteIcon.style.display = 'none';
      deleteIcon.dataset.task = i;

      const moreVertIcon = document.createElement('span');
      moreVertIcon.innerHTML = 'more_vert';
      moreVertIcon.classList.add('material-icons', 'dots-icon');

      todoTaskElement.append(todoTaskContent, deleteIcon, moreVertIcon);

      // Add the task element to the to-do list.
      this.todoListBox.appendChild(todoTaskElement);

      todoTaskElement.addEventListener(
        'focus',
        (event) => {
          event.currentTarget.querySelector('.dots-icon').style.display = 'none';
          event.currentTarget.querySelector('.trash-icon').style.display = '';
          event.currentTarget.style.backgroundColor = 'lightyellow';
        },
        true,
      );

      todoTaskElement.addEventListener(
        'blur',
        (event) => {
          event.currentTarget.querySelector('.dots-icon').style.display = '';
          event.currentTarget.querySelector('.trash-icon').style.display = 'none';
          event.currentTarget.style.backgroundColor = '';
        },
        true,
      );
    });

    // Update local storage.
    this.updateLocalStorage();
  }

  // Clears all completed tasks, updates local storage and the UI.
  clearAllCompletedTasks() {
    this.todoTask = clearAllCompleted(this.todoTask);
    this.todoTask.forEach((task, index) => {
      task.index = index + 1;
    });
    this.updateLocalStorage();
    this.render();
  }

  // Add new task with the given description, updates local storage and the UI.
  addTask(description) {
    if (description.trim() !== '') {
      const newTask = {
        description,
        completed: false,
        index: this.todoTask.length + 1,
      };
      this.todoTask.push(newTask);
      this.updateLocalStorage();
      this.render();
    }
  }

  // Delete task with matching id, updates local storage and UI.
  deleteTask(taskId) {
    this.todoTask.splice(taskId, 1);
    this.todoTask.forEach((task, index) => {
      task.index = index + 1;
    });
    this.updateLocalStorage();
    this.render();
  }

  // Edit task description, update local storage and UI.
  editTask(taskId, newDescription) {
    if (this.todoTask[taskId]) {
      this.todoTask[taskId].description = newDescription;
      this.updateLocalStorage();
    }
  }

  // Persist current state of tasks to local storage
  updateLocalStorage() {
    localStorage.setItem('todoTasks', JSON.stringify(this.todoTask));
  }
}

export default TodoApp;
