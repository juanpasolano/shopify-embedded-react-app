import mongoose, { Schema } from 'mongoose';

const mongoDb = process.env.MONGODB_URI || 'mongodb://localhost/shopify-app';
mongoose.Promise = global.Promise;
mongoose.connect(mongoDb);

const Products =  mongoose.model('Products', new Schema({
  shopifyId: String,
  data: Schema.Types.Mixed,
}));

const Sliders =  mongoose.model('Sliders', new Schema({
  name: String,
  products: [{ type: Schema.Types.ObjectId, ref: 'Products' }],
  shopName: String
}));


const db = {
  Products,
  Sliders,
}

export default db;
