import express, { Request, Response } from 'express';
import { Product } from './Product';
import { v4 as uuidv4 } from 'uuid';
import { connectDB } from './db';
import ProductModel, { IProduct } from './models/Product';
import { Update } from './Update';
import cors from 'cors'


const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Allow requests from React dev server
app.use(cors({
  origin: 'http://localhost:5173', // Change this to match your React dev server
  credentials: true, // if you're using cookies or sessions
}));

let products: Product[] = [
    {
        id_: uuidv4(),
        id: '1',
        title: 'Sample Product',
        image: 'https://example.com/image.jpg',
        price: 99.99,
        link: 'https://example.com/product'
    }
];

//Home Root
app.get('/', (req: Request, res: Response) => {
      res.send('Hello from Express with TypeScript!');
});

// READ all products
// Later dbl-chk
app.get('/products', async (req: Request, res: Response) => {
    try {
      const products = await ProductModel.find();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  });
  
// CREATE a new product
// Dbl-chk
app.post('/product', async (req: Request, res: Response) => {
  try {
    console.log("Here",req.body);
    const newProduct = new ProductModel({ id_: uuidv4(), ...req.body });
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// UPDATE a product by ID
// Dbl-Chk later
app.put('/products/:id', async (req: Request, res: Response) => {
    try {
      const updatedProduct = await ProductModel.findOneAndUpdate(
        { id: req.params.id },
        req.body,
        { new: true }
      );
      if (!updatedProduct) return res.status(404).json({ error: 'Product not found' });
      res.json(updatedProduct);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update product' });
    }
});

  
  app.delete('/products/:id', async (req: Request, res: Response) => {
    try {
      const deletedProduct = await ProductModel.findOneAndDelete({ id: req.params.id });
      if (!deletedProduct) return res.status(404).json({ error: 'Product not found' });
      res.json({ message: 'Product deleted', product: deletedProduct });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete product' });
    }
  });

(async () => {
  await connectDB();

  app.listen(port, () => {
    console.log(`🚀 Server is running on http://localhost:${port}`);
  });
})();