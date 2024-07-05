const fs = require('fs');
const path = require('path');

class Node {
  constructor(fileName, filePath) {
    this.fileName = fileName;
    this.filePath = filePath;
    this.left = null;
    this.right = null;
  }
}

class FileIndexer {
  constructor() {
    this.root = null;
  }

  //Insert node to tree
  insertNode(fileName, filePath) {
    //If the tree is empty, insert node here
    if (this.root === null) {
      this.root = new Node(fileName, filePath);
      return;
    }

    //If not empty, then go down the tree
    let current = this.root;
    while (true) {
      if (fileName.localeCompare(current.fileName) < 0) {
        if (current.left === null) {
          current.left = new Node(fileName, filePath);
          return;
        }
        current = current.left;
      } else {
        if (current.right === null) {
          current.right = new Node(fileName, filePath);
          return;
        }
        current = current.right;
      }
    }
  }

  //Index the specified directory
  indexDirectoryHelper(dirPath) {
    //if it's not a directory, return
    if (!fs.existsSync(dirPath)) return;

    //loop over files or directories within directory
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      if (fs.lstatSync(filePath).isDirectory()) {
        //if it is a directory, then call indexDirectoryHelper() recursively
        this.indexDirectoryHelper(filePath);
      } else {
        //insert file in tree
        this.insertNode(file, filePath);
      }
    }
  }

  deleteSubtree(root) {
    if (root !== null) {
      this.deleteSubtree(root.left);
      this.deleteSubtree(root.right);
      root = null;
    }
  }

  traverse(root) {
    if (root !== null) {
      this.traverse(root.left);
      console.log(`${root.fileName}: ${root.filePath}`);
      this.traverse(root.right);
    }
  }

  indexDirectory(directoryPath) {
    this.root = null;
    this.indexDirectoryHelper(directoryPath);
  }

  printFiles() {
    console.log('Indexed files:');
    this.traverse(this.root);
  }

  searchFileLocation(filename) {
    let current = this.root;
    while (current !== null) {
      if (filename === current.fileName) {
        return current.filePath;
      } else if (filename.localeCompare(current.fileName) < 0) {
        current = current.left;
      } else {
        current = current.right;
      }
    }
    return '';
  }
}

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

readline.question('Path to index recursively: ', (path) => {
  const indexer = new FileIndexer();
  indexer.indexDirectory(path);
  indexer.printFiles();

  readline.question("Let's search for a file's location. Give the file name: ", 
    (filenameToSearch) => {
    const location = indexer.searchFileLocation(filenameToSearch);
    if (location) {
      console.log(`File ${filenameToSearch} found. Location: ${location}`);
    } else {
      console.log(`File ${filenameToSearch} not found.`);
    }
    readline.close();
  });
});
