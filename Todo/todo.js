class Task {
  constructor(description, priority) {
    this.description = description;
    this.priority = priority;
    this.next = null;
  }
}

class TodoList {
  constructor() {
    this.head = null;
    this.size = 0;
  }

  addTask(description, priority) {
    const task = new Task(description, priority);
    task.next = null;

    if (this.head === null) {
      //List is empty
      this.head = task;
    } 
    else {
      let temp = this.head;
      //Find the last node
      while (temp.next !== null) {
        temp = temp.next;
      }
      //Insert the new task after the last node
      temp.next = task;
    }
    this.size++;
    return task;
  }

  removeTask(index) {
    if (index < 0 || index >= this.size) {
      console.error("Index out of bounds.");
      return;
    }

    if (index === 0) {
      //Removing the first item
      this.head = this.head.next;
    } 
    else {
      let current = this.head;
      let previous = null;
      let i = 0;

      while (i < index) {
        previous = current;
        current = current.next;
        i++;
      }

      if (previous !== null) {
        previous.next = current.next;
      }
    }

    this.size--;
  }

  displayTasks() {
    let temp = this.head;
    const todoListElem = document.getElementById("todoList");
    todoListElem.innerHTML = ""; //Clear previous list

    let index = 1;
    while (temp !== null) {
      const li = document.createElement("li");
      li.className = "todo-item";
      li.textContent = `${index}) Description: ${temp.description}, 
                        Priority: ${temp.priority}`;
      todoListElem.appendChild(li);
      temp = temp.next;
      index++;
    }
  }

  sortTasks() {
    //Bubble sort (descending order)
    let swapped;
    let ptr1;
    let ptr2 = null;

    if (this.head === null)
      return;

    do {
      swapped = false; //will change if swapping happens
      ptr1 = this.head;

      while (ptr1.next !== ptr2) {
        if (ptr1.priority > ptr1.next.priority) {
          //Swap data of adjacent nodes
          let tempPriority = ptr1.priority;
          ptr1.priority = ptr1.next.priority;
          ptr1.next.priority = tempPriority;

          let tempDescription = ptr1.description;
          ptr1.description = ptr1.next.description;
          ptr1.next.description = tempDescription;

          swapped = true; //swap happened in this loop pass; don't stop yet
        }
        ptr1 = ptr1.next;
      }
      ptr2 = ptr1;
    } while (swapped == true); //quit loop when no swap happened
  }
}

const todoList = new TodoList();

const todoForm = document.getElementById("todoForm");

//add submit event listener to Add Task form
todoForm.addEventListener("submit", function(event) {
  event.preventDefault();

  const description = document.getElementById("description").value;
  const priority = parseInt(document.getElementById("priority").value);

  if (isNaN(priority)) {
    alert("Priority must be a number.");
    return;
  }

  todoList.addTask(description, priority);
  todoList.displayTasks();

  //Clear input fields
  document.getElementById("description").value = "";
  document.getElementById("priority").value = "";
});

const removeForm = document.getElementById("removeForm");

//add submit event listener to Remove Task form
removeForm.addEventListener("submit", function(event) {
  event.preventDefault();

  const index = parseInt(document.getElementById("removeIndex").value);

  if (isNaN(index)) {
    alert("Index must be a number.");
    return;
  }

  if (index < 1 || index > todoList.size) {
    alert("Index out of bounds.");
    return;
  }

  todoList.removeTask(index - 1);
  todoList.displayTasks();

  //Clear input field
  document.getElementById("removeIndex").value = "";
});

const sortButton = document.getElementById("sortButton");

//add submit event listener to Sort Tasks form
sortButton.addEventListener("click", function(event) {
  todoList.sortTasks();
  todoList.displayTasks();
});
