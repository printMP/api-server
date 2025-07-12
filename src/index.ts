import express, { Request, Response } from 'express';
import { Product } from './Product';
import { v4 as uuidv4 } from 'uuid';
import { Update } from './Update';
import cors from 'cors'


const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());


// Allow requests from React dev server
app.use(cors({
  origin: 'http://localhost:5173', // Change this to match your React dev server
  credentials: true, // if you're using cookies or sessions
}));

// or just allow all origins (less secure, for dev only)
app.use(cors());


let products: Product[] = [
    {
        id: '1',
        title: 'Sample Product',
        image: 'https://example.com/image.jpg',
        price: 99.99,
        link: 'https://example.com/product'
    }
];

// Root route
app.get('/', (req: Request, res: Response) => {
    res.send('Hello from Express with typescript!');
});

// READ all products
app.get('/products', (req: Request, res: Response<Product[]>) => {
    res.json(products);
});

// CREATE a new product
app.post('/product', (req: Request, res: Response<Product>) => {
    const newProduct: Product = { id: uuidv4(), ...req.body };
    products.push(newProduct);
    console.log("The new product is ", newProduct);
    res.status(201).json(newProduct);
});

// UPDATE a product by ID
app.put('/products/:id', (req: Request<{ id: string }, {}, Update>, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;

    const index = products.findIndex(p => p.id === id);
    console.log("the index is ",index);
    console.log("the old data is ",products[index]);
    console.log("the new data is ",updateData);
    if (index === -1) {
        return res.status(404).json({ error: 'Product not found' });
    }

    products[index] = { ...products[index], ...updateData };
    res.json(products[index]);
});

app.delete('/products/:id', (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;

  const index = products.findIndex(p => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  // Remove product
  const deletedProduct = products.splice(index, 1)[0];
  console.log("the id is", id)
  console.log("the index is", index)
  console.log("the deleted product is", deletedProduct)
  res.json({ message: 'Product deleted', product: deletedProduct });
  
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});