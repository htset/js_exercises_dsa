const net = require('net');
const fs = require('fs');

class LRUCache {
  constructor() {
    this.CACHE_SIZE = 3;
    this.head = null;
    this.tail = null;
    this.size = 0;
  }

  //Get the content associated with a URL from the cache
  getContent(url) {
    let current = this.head;
    while (current !== null) {
      if (current.url === url) {
        this.moveToHead(current);
        console.log("Got content from cache: " + current.content);
        return current.content;
      }
      current = current.next;
    }
    return "";
  }

  //Put a URL-content pair into the cache
  putContent(url, content) {
    if (this.size === this.CACHE_SIZE) {
      this.deleteNode(this.tail);
      this.size--;
    }
    const newNode = this.createNode(url, content);
    this.insertAtHead(newNode);
    this.size++;
  }

  //Create a new node
  createNode(url, content) {
    const newNode = {
      url: url,
      content: content,
      prev: null,
      next: null
    };
    console.log("New node created: " + content);
    return newNode;
  }

  //Insert a new node at the head of the cache
  insertAtHead(node) {
    node.next = this.head;
    node.prev = null;
    if (this.head !== null)
      this.head.prev = node;
    this.head = node;
    if (this.tail === null)
      this.tail = node;
    console.log("Node inserted at head: " + node.content);
  }

  //Move a node to the head of the cache
  moveToHead(node) {
    if (node === this.head)
      return;
    if (node.prev !== null)
      node.prev.next = node.next;
    if (node.next !== null)
      node.next.prev = node.prev;
    node.prev = null;
    node.next = this.head;
    if (this.head !== null)
      this.head.prev = node;
    this.head = node;
    if (this.tail === null)
      this.tail = node;
    console.log("Node moved to head: " + node.content);
  }

  //Delete a node from the cache
  deleteNode(node) {
    if (node === null)
      return;
    if (node === this.head)
      this.head = node.next;
    if (node === this.tail)
      this.tail = node.prev;
    if (node.prev !== null)
      node.prev.next = node.next;
    if (node.next !== null)
      node.next.prev = node.prev;
    console.log("Node deleted: " + node.content);
  }
}

class HttpServer {
  constructor() {
    this.PORT = 8080;
    this.MAX_REQUEST_SIZE = 1024;
    this.cache = new LRUCache();
  }

  start() {
    const server = net.createServer((client) => {
      console.log("Client connected.");

      client.on('data', (data) => {
        const request = data.toString('utf-8');
        console.log("Received request: " + request);

        //Find request type (GET)
        const parts = request.split(' ');
        if (parts.length < 2 || parts[0] !== "GET") {
          console.log("Invalid request format.");
          return;
        }

        //Get request url and check whether it is already stored in the cache
        const url = parts[1];
        let content = this.cache.getContent(url);

        if (content === "") {
          try {
            //If not found in cache, read it from the HTML file
            //We assume the files are in the same directory as the executable
            content = fs.readFileSync(url.substring(1), 'utf-8');
            console.log("Got content from file: " + content);
            this.cache.putContent(url, content);
          } catch (error) {
            console.log("File not found: " + url.substring(1));
            content = "HTTP/1.1 404 Not Found\r\n\r\n";
          }
        } else {
          console.log("Serving content from cache.");
        }

        //Check if the content is HTML or plain text
        let contentType = "text/plain"; //Default content type is plain text
        if (url.endsWith(".html") || url.endsWith(".htm")) {
          //If the URL ends with .html or .htm, it's HTML content
          contentType = "text/html";
        }

        //Build the response
        const response = "HTTP/1.1 200 OK\r\nContent-Type: "
          + contentType + "\r\n\r\n" + content;
        client.write(response);
        client.end();
      });

      client.on('end', () => {
        console.log("Client disconnected.");
      });

      client.on('error', (error) => {
        console.error("Error with client:", error);
      });
    });

    server.listen(this.PORT, () => {
      console.log("Server started on port " + this.PORT);
    });
  }
}

const server = new HttpServer();
server.start();
