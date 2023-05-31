import express from 'express';
import fs from 'fs';

const app = express();
const port = 3000;

app.get('/products', (req, res) => {
  const limit = req.query.limit;
  let products = [];

  try {
    const data = fs.readFileSync('data.json', 'utf8');
    products = JSON.parse(data);
  } catch (error) {
    console.error('Error al leer el archivo de productos:', error);
  }

  if (limit) {
    products = products.slice(0, limit);
  }

  res.json(products);
});

app.get('/products/:pid', (req, res) => {
  const productId = parseInt(req.params.pid);
  let product = null;

  try {
    const data = fs.readFileSync('data.json', 'utf8');
    const products = JSON.parse(data);
    product = products.find((p) => p.id === productId);
  } catch (error) {
    console.error('Error al leer el archivo de productos:', error);
  }

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});