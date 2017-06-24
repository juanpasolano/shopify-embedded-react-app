"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _shopifyApiNode = require("shopify-api-node");

var _shopifyApiNode2 = _interopRequireDefault(_shopifyApiNode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Shop(shopName, token) {
  var _this = this;

  this.shopName = shopName;
  this.token = token;
  this.shopify = new _shopifyApiNode2.default({
    shopName: this.shopName,
    accessToken: this.token
  });

  //path ie '/products-create'
  //topic ie 'products/create'
  this.addWebhook = function (path, topic) {
    if (process.env.BASE_URL) {
      var address = process.env.BASE_URL + "webhook/" + path;
      return _this.shopify.webhook.create({
        topic: topic,
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
      src: process.env.BASE_URL + "scriptTag.js"
    }).then(function (res) {
      return console.log(res);
    }).catch(function (err) {
      return console.error(err);
    });
  };
}
exports.default = Shop;