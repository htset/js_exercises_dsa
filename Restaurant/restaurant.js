class Customer {
  constructor(name) {
    this.name = name;
  }
}

class Table {
  constructor(id, capacity) {
    this.id = id;
    this.capacity = capacity;
  }
}

class Reservation {
  constructor(customer, table, startTimeSlot, endTimeSlot) {
    this.customer = customer;
    this.table = table;
    this.startTimeSlot = startTimeSlot;
    this.endTimeSlot = endTimeSlot;
  }
}

class Restaurant {
  constructor() {
    this.tables = [];
    this.reservations = [];
  }

  addTable(table) {
    this.tables.push(table);
  }

  isTableAvailable(table, startTimeSlot, endTimeSlot) {
    return !this.reservations.some(reservation =>
      reservation.table.id === table.id &&
      (
        (startTimeSlot >= reservation.startTimeSlot 
          && startTimeSlot < reservation.endTimeSlot) ||
        (endTimeSlot > reservation.startTimeSlot 
          && endTimeSlot <= reservation.endTimeSlot) ||
        (startTimeSlot <= reservation.startTimeSlot 
          && endTimeSlot >= reservation.endTimeSlot)
      )
    );
  }

  findAvailableTables(capacity, startTimeSlot, endTimeSlot) {
    const availableTables = this.tables.filter(table =>
      table.capacity >= capacity 
        && this.isTableAvailable(table, startTimeSlot, endTimeSlot)
    );
    availableTables.sort((a, b) => a.capacity - b.capacity);
    return availableTables;
  }

  addReservation(name, capacity, startSlot, endSlot) {
    const availableTables = this.findAvailableTables(capacity, startSlot, endSlot);
    if (availableTables.length > 0) {
      this.reservations.push(
        new Reservation(new Customer(name), 
          availableTables[0], 
          startSlot, 
          endSlot)
        );
      console.log("Reservation successfully added.");
    } else {
      console.log("No available tables for the requested time slot.");
    }
  }

  printReservations() {
    console.log("All reservations:");
    for (const reservation of this.reservations) {
      console.log(`Customer: ${reservation.customer.name}, 
        Table Capacity: ${reservation.table.capacity}, 
        Start Time Slot: ${reservation.startTimeSlot}, 
        End Time Slot: ${reservation.endTimeSlot}`);
    }
  }
}

const restaurant = new Restaurant();

//Add tables
restaurant.addTable(new Table(1, 6));
restaurant.addTable(new Table(2, 4));
restaurant.addTable(new Table(3, 2));

//Find available tables for a new reservation
restaurant.addReservation("Customer 1", 4, 1, 3);
restaurant.addReservation("Customer 2", 6, 2, 4);
restaurant.addReservation("Customer 3", 4, 3, 5);
restaurant.addReservation("Customer 4", 4, 1, 3);

restaurant.printReservations();
