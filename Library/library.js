const fs = require('fs');
const readline = require('readline');

class Book {
  constructor(title, author, available) {
    this.Title = title;
    this.Author = author;
    this.Available = available;
  }
}

class LendingEvent {
  constructor(bookTitle, userName, lendingDate, returned) {
    this.BookTitle = bookTitle;
    this.UserName = userName;
    this.LendingDate = lendingDate;
    this.Returned = returned;
  }
}

class Library {
  constructor() {
    this.BooksFilename = 'books.txt';
    this.LendingFilename = 'lending_events.txt';
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  async addBook() {
    const book = new Book();

    book.Title = await this.question('Book title: ');
    book.Author = await this.question('Author: ');
    book.Available = 1;

    fs.appendFileSync(this.BooksFilename, 
      `${book.Title}|${book.Author}|${book.Available}\n`);

    console.log('Book added successfully.');
  }

  listBooks() {
    if (!fs.existsSync(this.BooksFilename)) {
      console.log('No books entered so far');
      return;
    }

    console.log('Books available in the library:');
    const lines = fs.readFileSync(this.BooksFilename, 'utf8').split('\n');
    lines.forEach(line => {
      if (line.trim() !== '') {
        const parts = line.split('|');
        console.log(`Title: ${parts[0]}`);
        console.log(`Author: ${parts[1]}`);
        console.log(`Available: ${parts[2] === '1' ? 'True' : 'False'}`);
        console.log('------------------------------');
      }
    });
  }

  async lendBook() {
    if (!fs.existsSync(this.BooksFilename)) {
      console.log('No books entered so far');
      return;
    }

    let bookTitle = await this.question('Enter the title of the book to lend: ');

    let lines = fs.readFileSync(this.BooksFilename, 'utf8').split('\n');
    let bookFound = false;

    for (let i = 0; i < lines.length; i++) {
      const parts = lines[i].split('|');
      if (parts[0] === bookTitle && parts[2] === '1') {
        lines[i] = `${parts[0]}|${parts[1]}|0`;
        bookFound = true;

        let userName = await this.question('Enter your name: ');

        fs.appendFileSync(this.LendingFilename, 
          `${bookTitle}|${userName}|${new Date()}|0\n`);
        console.log(`Book '${bookTitle}' has been lent to ${userName}.`);

        break;
      }
    }

    if (!bookFound) {
      console.log(`Book '${bookTitle}' not found or not available.`);
    }

    fs.writeFileSync(this.BooksFilename, lines.join('\n'));
  }

  async returnBook() {
    if (!fs.existsSync(this.LendingFilename)) {
      console.log('No lending events entered so far');
      return;
    }

    let bookTitle = await this.question('Enter the title of the book to return: ');

    let booksLines = fs.readFileSync(this.BooksFilename, 'utf8').split('\n');
    let bookFound = false;

    for (let i = 0; i < booksLines.length; i++) {
      const parts = booksLines[i].split('|');
      if (parts[0] === bookTitle && parts[2] === '0') {
        booksLines[i] = `${parts[0]}|${parts[1]}|1`;
        bookFound = true;

        let lendingLines = fs.readFileSync(this.LendingFilename, 'utf8').split('\n');

        for (let j = 0; j < lendingLines.length; j++) {
          const lendingParts = lendingLines[j].split('|');
          if (lendingParts[0] === bookTitle && lendingParts[3] === '0') {
            lendingLines[j] = `${lendingParts[0]}|${lendingParts[1]}|${lendingParts[2]}|1`;
            console.log(`Book '${bookTitle}' has been returned.`);
            break;
          }
        }

        fs.writeFileSync(this.LendingFilename, lendingLines.join('\n'));
        break;
      }
    }

    if (!bookFound) {
      console.log(`Book '${bookTitle}' not found or already returned.`);
    }

    fs.writeFileSync(this.BooksFilename, booksLines.join('\n'));
  }

  listLendingEvents() {
    if (!fs.existsSync(this.LendingFilename)) {
      console.log('No lending events entered so far');
      return;
    }

    console.log('Lending events:');
    const lines = fs.readFileSync(this.LendingFilename, 'utf8').split('\n');
    lines.forEach(line => {
      if (line.trim() !== '') {
        const parts = line.split('|');
        console.log(`Book Title: ${parts[0]}`);
        console.log(`User Name: ${parts[1]}`);
        console.log(`Lending Date: ${parts[2]}`);
        console.log(`Returned: ${parts[3] === '1' ? 'True' : 'False'}`);
        console.log('------------------------------');
      }
    });
  }

  async question(prompt) {
    return new Promise((resolve) => {
      this.rl.question(prompt, (answer) => {
        resolve(answer);
      });
    });
  }

  async menu() {
    let choice;

    do {
      console.log('\n1. Add a book\n2. List all books\n' +
        '3. Lend a book\n4. Return a book\n5. List lending events\n0. Exit');
      choice = parseInt(await this.question('Enter your choice: '));

      switch (choice) {
        case 1:
          await this.addBook();
          break;
        case 2:
          this.listBooks();
          break;
        case 3:
          await this.lendBook();
          break;
        case 4:
          await this.returnBook();
          break;
        case 5:
          this.listLendingEvents();
          break;
        case 0:
          console.log('Exiting.');
          break;
        default:
          console.log('Invalid choice. Please try again.');
          break;
      }

    } while (choice !== 0);

    this.rl.close(); //Close readline interface after all operations are done
  }
}

//Run the main function
(async () => {
  const lib = new Library();
  await lib.menu();
})();
