'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mongoDb = process.env.MONGODB_URI || 'mongodb://localhost/shopify-app';
_mongoose2.default.Promise = global.Promise;
_mongoose2.default.connect(mongoDb);

var Products = _mongoose2.default.model('Products', new _mongoose.Schema({
  shopifyId: String,
  data: _mongoose.Schema.Types.Mixed,
  _slider: { type: _mongoose.Schema.Types.ObjectId, ref: 'Sliders' }
}));

var Sliders = _mongoose2.default.model('Sliders', new _mongoose.Schema({
  name: String,
  products: [{ type: _mongoose.Schema.Types.ObjectId, ref: 'Products' }],
  shopName: String
}));

var Shops = _mongoose2.default.model('Shops', new _mongoose.Schema({
  shopName: String,
  products: [String]
}));

var db = {
  Products: Products,
  Sliders: Sliders,
  Shops: Shops,
  mongoose: _mongoose2.default
};

exports.default = db;