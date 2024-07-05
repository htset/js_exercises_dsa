class FriendNode {
  constructor(name) {
    this.name = name;
    this.next = null;
  }
}

class User {
  constructor(name) {
    this.name = name;
    this.friends = null;
  }
}

class QueueNode {
  constructor(userIndex) {
    this.userIndex = userIndex;
    this.next = null;
  }
}

class Queue {
  constructor() {
    this.front = null;
    this.rear = null;
  }

  //Check if the queue is empty
  isEmpty() {
    return this.front === null;
  }

  //Add an element to the queue
  enqueue(userIndex) {
    const newNode = new QueueNode(userIndex);
    if (this.isEmpty()) {
      this.front = this.rear = newNode;
    } else {
      this.rear.next = newNode;
      this.rear = newNode;
    }
  }

  //Remove an element from the queue
  dequeue() {
    if (this.isEmpty()) {
      console.log("Queue is empty!");
      return -1;
    }

    const temp = this.front;
    const userIndex = temp.userIndex;
    this.front = this.front.next;

    if (this.front === null) {
      this.rear = null;
    }

    return userIndex;
  }
}

class Graph {
  constructor() {
    this.MAX_USERS = 100;
    this.users = [];
    this.numUsers = 0;
  }

  //Add a new user to the graph
  addUser(name) {
    if (this.numUsers >= this.MAX_USERS) {
      console.log("Max user limit reached!");
      return;
    }

    this.users.push(new User(name));
    this.numUsers++;
  }

  //Add a connection (friendship) between two users
  addConnection(src, dest) {
    if (src < 0 || src >= this.numUsers || dest < 0 || dest >= this.numUsers) {
      console.log("Invalid user index!");
      return;
    }

    const newFriendSrc = new FriendNode(this.users[dest].name);
    newFriendSrc.next = this.users[src].friends;
    this.users[src].friends = newFriendSrc;

    const newFriendDest = new FriendNode(this.users[src].name);
    newFriendDest.next = this.users[dest].friends;
    this.users[dest].friends = newFriendDest;
  }

  //Recommend friends for a given user
  recommendFriends(userIndex) {
    console.log(`Recommended friends for ${this.users[userIndex].name}:`);

    const queue = new Queue();
    const visited = Array(this.MAX_USERS).fill(0);

    visited[userIndex] = 1;
    queue.enqueue(userIndex);

    while (!queue.isEmpty()) {
      const currentUserIndex = queue.dequeue();
      let current = this.users[currentUserIndex].friends;

      while (current !== null) {
        let friendIndex = -1;
        for (let i = 0; i < this.numUsers; i++) {
          if (current.name === this.users[i].name) {
            friendIndex = i;
            break;
          }
        }

        if (friendIndex !== -1 && visited[friendIndex] === 0) {
          console.log(`- ${current.name}`);
          visited[friendIndex] = 1;
          queue.enqueue(friendIndex);
        }

        current = current.next;
      }
    }
  }
}

function main() {
  const graph = new Graph();
  graph.addUser("User A");
  graph.addUser("User B");
  graph.addUser("User C");
  graph.addUser("User D");
  graph.addUser("User E");
  graph.addUser("User F");
  graph.addUser("User G");
  graph.addUser("User H");

  graph.addConnection(0, 1);
  graph.addConnection(1, 2);
  graph.addConnection(2, 3);
  graph.addConnection(4, 5);
  graph.addConnection(5, 7);
  graph.addConnection(3, 6);

  //Recommend friends for specified users
  graph.recommendFriends(0);
  graph.recommendFriends(1);
  graph.recommendFriends(7);
}

main();
