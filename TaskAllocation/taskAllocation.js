class Task {
  constructor(description, duration) {
    this.description = description;
    this.duration = duration;
  }
}

class Worker {
  constructor(id, workload) {
    this.id = id;
    this.workload = workload;
  }
}

class PriorityQueue {
  constructor() {
    this.workers = [];
  }

  enqueue(worker) {
    let added = false;

    for (let i = 0; i < this.workers.length; i++) {
      if (this.workers[i].workload > worker.workload) {
        this.workers.splice(i, 0, worker);
        added = true;
        break;
      }
    }

    if (!added) {
      this.workers.push(worker);
    }
  }

  dequeue() {
    return this.workers.shift();
  }

  get count() {
    return this.workers.length;
  }
}

class TaskAllocation {
  static addTask(workerQueue, tasks) {
    const description = document.getElementById('description').value;
    const duration = parseInt(document.getElementById('duration').value, 10);

    if (workerQueue.count === 0) {
      alert("No workers available! Task cannot be assigned.");
      return;
    }

    //Dequeue the worker with the shortest workload
    const worker = workerQueue.dequeue();

    //Assign the task to the worker and update workload
    tasks.push(new Task(description, duration));
    alert(`Task added successfully and allocated to Worker ${worker.id}!`);

    //Update workload
    worker.workload += duration;
    workerQueue.enqueue(worker);
  }

  static displayTasks(tasks, taskList) {
    taskList.innerHTML = '';
    tasks.forEach(task => {
      const li = document.createElement('li');
      li.textContent = `Task description: ${task.description}, 
        Duration: ${task.duration} minutes`;
      taskList.appendChild(li);
    });
  }

  static displayWorkers(workerQueue, workerList) {
    workerList.innerHTML = '';
    workerQueue.workers.forEach(item => {
      const li = document.createElement('li');
      li.textContent = `Worker ID: ${item.id}, 
        Workload: ${item.workload} minutes`;
      workerList.appendChild(li);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const tasks = [];
  const workerQueue = new PriorityQueue();
  const numWorkers = parseInt(prompt("Enter the number of workers: "), 10);

  //Initialize workers with ID and 0 workload
  for (let i = 0; i < numWorkers; i++) {
    workerQueue.enqueue(new Worker(i, 0));
  }

  const taskForm = document.getElementById('taskForm');
  const taskList = document.getElementById('taskList');
  const workerList = document.getElementById('workerList');

  taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    TaskAllocation.addTask(workerQueue, tasks);
    TaskAllocation.displayTasks(tasks, taskList);
    TaskAllocation.displayWorkers(workerQueue, workerList);
  });

});
