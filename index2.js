const fs = require('fs');

class ProductManager {
  constructor(path) {
    this.products = [];
    this.lastProductId = 0;
    this.path = path;
    this.loadProducts();
  }

  loadProducts() {
    try {
      const data = fs.readFileSync(this.path, 'utf8');
      this.products = JSON.parse(data);
      this.updateLastProductId();
    } catch (error) {
      // Si ocurre algún error al leer el archivo, se asume que no existen productos aún.
      this.products = [];
      this.lastProductId = 0;
    }
  }

  updateLastProductId() {
    if (this.products.length > 0) {
      const lastProduct = this.products[this.products.length - 1];
      this.lastProductId = lastProduct.id;
    } else {
      this.lastProductId = 0;
    }
  }

  saveProducts() {
    const data = JSON.stringify(this.products, null, 2);
    fs.writeFileSync(this.path, data, 'utf8');
  }

  addProduct(product) {
    if (!this.validateProduct(product)) {
      console.log('Error: Todos los campos son obligatorios y el código no debe repetirse.');
      return;
    }

    const newProduct = {
      id: ++this.lastProductId,
      title: product.title,
      description: product.description,
      price: product.price,
      thumbnail: product.thumbnail,
      code: product.code,
      stock: product.stock
    };

    this.products.push(newProduct);
    this.saveProducts();
  }

  validateProduct(product) {
    if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
      return false;
    }

    const existingProduct = this.products.find(p => p.code === product.code);
    if (existingProduct) {
      return false;
    }

    return true;
  }

  getProducts() {
    return this.products;
  }

  getProductById(id) {
    const product = this.products.find(p => p.id === id);

    if (product) {
      return product;
    } else {
      console.log('Error: Producto no encontrado.');
    }
  }

  updateProduct(id, updatedFields) {
    const productIndex = this.products.findIndex(p => p.id === id);

    if (productIndex !== -1) {
      const updatedProduct = { ...this.products[productIndex], ...updatedFields };
      this.products[productIndex] = updatedProduct;
      this.saveProducts();
    } else {
      console.log('Error: Producto no encontrado.');
    }
  }

  deleteProduct(id) {
    const productIndex = this.products.findIndex(p => p.id === id);

    if (productIndex !== -1) {
      this.products.splice(productIndex, 1);
      this.saveProducts();
    } else {
      console.log('Error: Producto no encontrado.');
    }
  }
}

const productManager = new ProductManager('data.json');

productManager.addProduct({
    title: 'Producto 1',
    description: 'Descripción del producto 1',
    price: 10.99,
    thumbnail: 'ruta/imagen1.jpg',
    code: 'ABC123',
    stock: 50
  });

  productManager.addProduct({
    title: 'Producto 2',
    description: 'Descripción del producto 2',
    price: 19.99,
    thumbnail: 'ruta/imagen2.jpg',
    code: 'DEF456',
    stock: 30
  });

  // Obtener todos los productos
const allProducts = productManager.getProducts();
console.log(allProducts);

// Obtener producto por id
const productById = productManager.getProductById(1); // Cambia el número por el id del producto deseado
console.log(productById);

// Obtener producto por id inexistente
const nonexistentProduct = productManager.getProductById(3); // Cambia el número por un id inexistente

// Update de producto por ID

const productIdToUpdate = 1;
const updatedFields = {
  price: 29.99,
  stock: 10
};

productManager.updateProduct(productIdToUpdate, updatedFields);

// Eliminar producto con ID 1

// productManager.deleteProduct(1);

export default ProductManager