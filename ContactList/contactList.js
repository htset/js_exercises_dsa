class Contact {
  constructor() {
    this.name = null;
    this.phone = null;
    this.next = null;
  }
}

class ContactList {
  constructor() {
    this.HASH_SIZE = 100;
    this.bucketTable = new Array(this.HASH_SIZE).fill(null);
  }

  hash(name) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      const charCode = name.charCodeAt(i);
      hash = ((hash << 5) + hash) + charCode;
    }
    return hash % this.HASH_SIZE;
  }

  contactAdd(name, phone) {
    const hashIndex = this.hash(name);
    const newContact = new Contact();
    newContact.name = name;
    newContact.phone = phone;
    newContact.next = this.bucketTable[hashIndex];
    this.bucketTable[hashIndex] = newContact;
  }

  contactRemove(name) {
    const index = this.hash(name);
    let contact = this.bucketTable[index];
    let previous = null;

    while (contact !== null) {
      if (contact.name === name) {
        if (previous === null) {
          //Contact to remove is the head of the list
          this.bucketTable[index] = contact.next;
        } else {
          //Contact to remove is not the head of the list
          previous.next = contact.next;
        }
        console.log(`Contact '${name}' removed successfully.`);
        return;
      }
      previous = contact;
      contact = contact.next;
    }
    console.log(`Contact '${name}' not found.`);
  }

  contactSearch(name) {
    const hashIndex = this.hash(name);
    let contact = this.bucketTable[hashIndex];
    while (contact !== null) {
      if (contact.name === name) {
        console.log(`Name: ${contact.name}\nPhone Number: ${contact.phone}`);
        return;
      }
      contact = contact.next;
    }
    console.log(`Contact '${name}' not found.`);
  }
}

const phonebook = new ContactList();
phonebook.contactAdd("John", "235454545");
phonebook.contactAdd("Jane", "775755454");
phonebook.contactAdd("George", "4344343477");

phonebook.contactSearch("John");
phonebook.contactSearch("Alex");
phonebook.contactSearch("George");

phonebook.contactRemove("Jake");
phonebook.contactRemove("Jane");
phonebook.contactSearch("Jane");
