import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  id: string;
  title: string;
  image: string;
  price: number;
  link: string;
}

const ProductSchema: Schema = new Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  link: { type: String, required: true },
});

export default mongoose.model<IProduct>('Product', ProductSchema);