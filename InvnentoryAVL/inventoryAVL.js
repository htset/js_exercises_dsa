class Product {
  constructor(id, name, price, quantity) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.quantity = quantity;
  }
}

class InventoryNode {
  constructor(product) {
    this.product = product;
    this.left = null;
    this.right = null;
    this.height = 1;
  }
}

class Inventory {
  constructor() {
    this.root = null;
  }

  getHeight(node) {
    return node === null ? 0 : node.height;
  }

  getBalance(node) {
    return node === null ? 0 : this.getHeight(node.left) - this.getHeight(node.right);
  }

  newNode(product) {
    return new InventoryNode(product);
  }

  rotateRight(y) {
    const x = y.left;
    const T2 = x.right;

    x.right = y;
    y.left = T2;

    y.height = Math.max(this.getHeight(y.left), this.getHeight(y.right)) + 1;
    x.height = Math.max(this.getHeight(x.left), this.getHeight(x.right)) + 1;

    return x;
  }

  rotateLeft(x) {
    const y = x.right;
    const T2 = y.left;

    y.left = x;
    x.right = T2;

    x.height = Math.max(this.getHeight(x.left), this.getHeight(x.right)) + 1;
    y.height = Math.max(this.getHeight(y.left), this.getHeight(y.right)) + 1;

    return y;
  }

  insertProduct(node, product) {
    if (node === null) return this.newNode(product);

    if (product.id < node.product.id) {
      node.left = this.insertProduct(node.left, product);
    } else if (product.id > node.product.id) {
      node.right = this.insertProduct(node.right, product);
    } else {
      return node;
    }

    node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));

    const balance = this.getBalance(node);

    if (balance > 1 && product.id < node.left.product.id) {
      return this.rotateRight(node);
    }

    if (balance < -1 && product.id > node.right.product.id) {
      return this.rotateLeft(node);
    }

    if (balance > 1 && product.id > node.left.product.id) {
      node.left = this.rotateLeft(node.left);
      return this.rotateRight(node);
    }

    if (balance < -1 && product.id < node.right.product.id) {
      node.right = this.rotateRight(node.right);
      return this.rotateLeft(node);
    }

    return node;
  }

  traverseTree(node) {
    if (node !== null) {
      this.traverseTree(node.left);
      console.log(`ID: ${node.product.id}, 
                  Name: ${node.product.name}, 
                  Price: ${node.product.price}, 
                  Quantity: ${node.product.quantity}`);
      this.traverseTree(node.right);
    }
  }

  searchProduct(node, id) {
    if (node === null || node.product.id === id) {
      if (node === null) {
        console.log('Product not found.');
      } else {
        console.log(`Found product: ID: ${node.product.id}, 
                    Name: ${node.product.name}, 
                    Price: ${node.product.price}, 
                    Quantity: ${node.product.quantity}`);
      }
      return node;
    }

    console.log(`Visited product ID: ${node.product.id}`);

    if (id < node.product.id) {
      return this.searchProduct(node.left, id);
    } else {
      return this.searchProduct(node.right, id);
    }
  }

  insertProductPublic(product) {
    this.root = this.insertProduct(this.root, product);
  }

  traverseTreePublic() {
    this.traverseTree(this.root);
  }

  searchProductPublic(id) {
    return this.searchProduct(this.root, id);
  }
}

const inventory = new Inventory();
const products = Array.from({ length: 100 }, 
  (_, i) => new Product(i + 1, `Product ${i + 1}`, 
    (Math.random() * 1000) / 10, Math.floor(Math.random() * 100) + 1));

//Shuffle products
for (let i = products.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [products[i], products[j]] = [products[j], products[i]];
}

//Insert products into inventory
for (const product of products) {
  inventory.insertProductPublic(product);
}

console.log('Inventory:');
inventory.traverseTreePublic();

const productIdToSearch = 35;
const foundProduct = inventory.searchProductPublic(productIdToSearch);

if (foundProduct !== null) {
  console.log(`Product found: ID: ${foundProduct.product.id}, 
              Name: ${foundProduct.product.name}, 
              Price: ${foundProduct.product.price}, 
              Quantity: ${foundProduct.product.quantity}`);
} else {
  console.log(`Product with ID ${productIdToSearch} not found.`);
}
