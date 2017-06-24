import mongoose, { Schema } from 'mongoose';

const mongoDb = process.env.MONGODB_URI || 'mongodb://localhost/shopify-app';
mongoose.Promise = global.Promise;
mongoose.connect(mongoDb);

const Products =  mongoose.model('Products', new Schema({
  shopifyId: String,
  data: Schema.Types.Mixed,
  _slider: { type: Schema.Types.ObjectId, ref: 'Sliders' },
}));

const Sliders =  mongoose.model('Sliders', new Schema({
  name: String,
  products: [{ type: Schema.Types.ObjectId, ref: 'Products' }],
  shopName: String
}));

const Shops =  mongoose.model('Shops', new Schema({
  shopName: String,
  products: [String]
}));


const db = {
  Products,
  Sliders,
  Shops,
  mongoose,
}

export default db;
