class Point {
  constructor(row = 0, col = 0) {
    this.row = row;
    this.col = col;
  }
}

class Stack {
  constructor() {
    this.items = [];
  }

  //Push a character onto the stack
  push(c) {
    this.items.push(c);
  }

  //Pop a character from the stack
  pop() {
    if (this.items.length === 0) {
      console.log('Stack is empty');
      process.exit(1);
    }
    return this.items.pop();
  }

  //Check if the stack is empty
  checkEmpty() {
    return this.items.length === 0;
  }
}

class Maze {
  constructor() {
    this.ROWS = 15;
    this.COLS = 15;
    this.matrix = [
      [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0],
      [0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0],
      [0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0],
      [0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0],
      [0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0],
      [0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0],
      [0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0],
      [0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0],
      [0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0],
      [0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0],
      [0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0],
      [0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    ];
    this.stack = new Stack();
  }

  canMove(row, col) {
    return row >= 0 
            && row < this.ROWS 
            && col >= 0 
            && col < this.COLS 
            && this.matrix[row][col] === 0;
  }

  print() {
    for (let i = 0; i < this.ROWS; i++) {
      console.log(this.matrix[i].join(' '));
    }
  }

  solve(row, col) {
    if (row === this.ROWS - 1 && col === this.COLS - 1) {
      this.stack.push(new Point(row, col));
      return 1;
    }

    if (this.canMove(row, col)) {
      this.stack.push(new Point(row, col));
      this.matrix[row][col] = 2; //Marking visited

      if (this.solve(row, col + 1) === 1) return 1; //Move right
      if (this.solve(row + 1, col) === 1) return 1; //Move down
      if (this.solve(row, col - 1) === 1) return 1; //Move left
      if (this.solve(row - 1, col) === 1) return 1; //Move up

      this.stack.pop(); //Backtrack
      return 0;
    }

    return 0;
  }

  printPath() {
    const path = [];
    while (!this.stack.checkEmpty()) {
      const p = this.stack.pop();
      path.push(`(${p.row}, ${p.col})`);
    }
    console.log(path.reverse().join(', '));
  }
}

const maze = new Maze();

console.log('This is the maze:');
maze.print();

if (maze.solve(0, 0) === 1) {
  console.log('\n\nThis is the path found:');
  maze.printPath();

  console.log('\n\nThis is the maze with all the points crossed:');
  maze.print();
} else {
  console.log('No path found');
}
