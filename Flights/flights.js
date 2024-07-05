const { MinPriorityQueue } = require('@datastructures-js/priority-queue');
const readline = require('readline');

//Structure to represent each city
class City {
  constructor(name) {
    this.name = name;
    this.flights = new Map();
  }
}

//Graph class to represent all cities and flights
class FlightGraph {
  constructor() {
    //Map of city names and their objects
    this.cities = new Map();
  }

  //Add a city to the graph
  addCity(name) {
    this.cities.set(name, new City(name));
  }

  //Add a flight between two cities and its cost
  addFlight(src, dest, cost) {
    //Assuming flights are bidirectional
    this.cities.get(src).flights.set(dest, cost);
    this.cities.get(dest).flights.set(src, cost);
  }

  //Function to find the cheapest route between two cities 
  //using Dijkstra's algorithm
  findCheapestRoute(src, dest) {
    //Initialize the distance map and previous node map
    const dist = new Map();
    const prev = new Map();
    const pq = new MinPriorityQueue();

    //Set all distances to infinity initially
    for (const city of this.cities.keys()) {
      dist.set(city, Infinity);
      prev.set(city, null);
    }

    //Distance to the source is 0
    dist.set(src, 0);
    pq.enqueue({ element: src, priority: 0 });

    //Main loop to process each node
    while (!pq.isEmpty()) {
      const { element: u, priority: uDist } = pq.dequeue();

      //Process each neighbor of the current node
      for (const [v, cost] of this.cities.get(u).flights.entries()) {
        //If a shorter path to v is found
        if (dist.get(u) !== Infinity && dist.get(u) + cost < dist.get(v)) {
          dist.set(v, dist.get(u) + cost);
          prev.set(v, u);
          pq.enqueue({ element: v, priority: dist.get(v) });
        }
      }
    }

    //Reconstructing the path from source to destination
    const path = [];
    for (let at = dest; at !== null; at = prev.get(at)) {
      path.push(at);
    }
    path.reverse();

    return { path, totalPrice: dist.get(dest) };
  }

  //Display all possible flights between two cities using DFS
  displayAllFlights(src, dest) {
    if (!this.cities.has(src) || !this.cities.has(dest)) {
      console.log('Invalid cities entered.');
      return;
    }

    const visited = new Set();
    const path = [];
    path.push(src);
    this.dfs(src, dest, visited, path);
  }

  //Recursive DFS function to find all flights between source and destination
  dfs(src, dest, visited, path) {
    visited.add(src);

    if (src === dest) {
      this.printPath(path);
    } else {
      for (const flight of this.cities.get(src).flights.keys()) {
        if (!visited.has(flight)) {
          path.push(flight);
          this.dfs(flight, dest, visited, path);
          path.pop();
        }
      }
    }

    visited.delete(src);
  }

  //Helper function to print a path (array content)
  printPath(path) {
    console.log(path.join(' -> '));
  }
}

const graph = new FlightGraph();

graph.addCity("London");
graph.addCity("Paris");
graph.addCity("Berlin");
graph.addCity("Rome");
graph.addCity("Madrid");
graph.addCity("Amsterdam");

graph.addFlight("London", "Paris", 100);
graph.addFlight("London", "Berlin", 150);
graph.addFlight("London", "Madrid", 200);
graph.addFlight("Paris", "Berlin", 120);
graph.addFlight("Paris", "Rome", 180);
graph.addFlight("Berlin", "Rome", 220);
graph.addFlight("Madrid", "Rome", 250);
graph.addFlight("Madrid", "Amsterdam", 170);
graph.addFlight("Amsterdam", "Berlin", 130);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question("Enter departure city: ", departure => {
  rl.question("Enter destination city: ", destination => {
    //Display all possible flights
    console.log(`All possible flights between ${departure} and ${destination}:`);
    graph.displayAllFlights(departure, destination);

    //Find the cheapest route and total price
    const { path, totalPrice } = graph.findCheapestRoute(departure, destination);

    //Display the cheapest route and total price
    console.log(`Cheapest Route: ${path.join(' -> ')}`);
    console.log(`Total Price: ${totalPrice}`);

    rl.close();
  });
});
