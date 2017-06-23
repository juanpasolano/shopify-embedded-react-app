'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _shopifyApiNode = require('shopify-api-node');

var _shopifyApiNode2 = _interopRequireDefault(_shopifyApiNode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Shop(shop, token) {
  var _this = this;

  this.shop = shop;
  this.token = token;
  this.shopify = new _shopifyApiNode2.default({
    shopName: this.shop,
    accessToken: this.token
  });
  this.addWebhook = function () {
    if (process.env.BASE_URL) {
      var address = process.env.BASE_URL + 'webhook/products-create';
      return _this.shopify.webhook.create({
        topic: 'products/create',
        address: address
      }).then(function (res) {
        return console.log(res);
      }).catch(function (err) {
        return console.error(err);
      });
    }
  };
  this.addScriptTag = function () {
    return _this.shopify.scriptTag.create({
      event: "onload",
      src: process.env.BASE_URL + 'scriptTag.js'
    }).then(function (res) {
      return console.log(res);
    }).catch(function (err) {
      return console.error(err);
    });
  };
}
exports.default = Shop;