const fs = require('fs');
const readline = require('readline');

//Stack class
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

//Function to check if the syntax in a file is balanced
function checkBalanced(filename) {
  const stack = new Stack();
  const data = fs.readFileSync(filename, 'utf8');

  for (let i = 0; i < data.length; i++) {
    const c = data[i];

    if (c === '(' || c === '[' || c === '{') {
      stack.push(c);
    } else if (c === ')' || c === ']' || c === '}') {
      if (stack.checkEmpty()) {
        return 0;
      }

      const openingChar = stack.pop();

      if (
        (c === ')' && openingChar !== '(') ||
        (c === ']' && openingChar !== '[') ||
        (c === '}' && openingChar !== '{')
      ) {
        return 0;
      }
    }
  }

  return stack.checkEmpty() ? 1 : 0;
}

//Main function to prompt for file path and check balance
function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question('Path to the source file: ', (filename) => {
    if (checkBalanced(filename) === 1) {
      console.log('The input file is balanced.');
    } else {
      console.log('The input file is not balanced.');
    }
    rl.close();
  });
}

main();
