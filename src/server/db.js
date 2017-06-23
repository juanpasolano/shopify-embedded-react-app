import mongoose, { Schema } from 'mongoose';

const mongoDb = process.env.MONGODB_URI || 'mongodb://localhost/shopify-app';
mongoose.Promise = global.Promise;
mongoose.connect(mongoDb);

const Products =  mongoose.model('Products', new Schema({
  productId: String,
  data: [Schema.Types.Mixed]
}));

const Sliders =  mongoose.model('Sliders', new Schema({
  name: String,
  porducts: [String],
  shopId: [String]
}));
const Shops =  mongoose.model('Shops', new Schema({
  name: String,
  porducts: [String]
}));


const db = {
  Products,
  Sliders,
  Shops,
}

export default db;
