'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

var _db = require('./db');

var _db2 = _interopRequireDefault(_db);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var apiRouter = _express2.default.Router();
apiRouter.route('/sliders').post(function (req, res) {

  var slider = new _db2.default.Sliders({
    name: req.body.name,
    shopName: req.session.shopName
  });

  _async2.default.each(req.body.products || [], function (product, cb) {
    _db2.default.Products.findOne({ shopifyId: product.id }, function (err, foundProduct) {
      if (!foundProduct) {
        //createit
        var newProduct = new _db2.default.Products({
          data: product,
          shopifyId: product.id,
          _slider: slider._id
        });
        newProduct.save();
        slider.products.push(newProduct);
        cb(err);
      } else {
        //push
        slider.products.push(foundProduct);
        cb(err);
      }
    });
  }, function (err) {
    slider.save(function (err, slider) {
      if (err) {
        res.status(400).send(err);
      } else {
        res.status(200).send(slider);
      }
    });
  }

  /*
  slider.save((err, slider)=> {
    if(err){
      res.status(400).send(err)
    } else {
      const _products = (req.body.products || []).map(p => ({data:p, _slider: slider._id}))
       db.Products.create(_products, (err, products)=> {
        if(err) {
          res.status(400).send(err)
        } else {
          products.forEach((product) => {
            slider.products.push(product);
          });
          slider.save()
          res.status(200).send(slider)
        }
      })
    }
  })
  */
  );
}).get(function (req, res) {
  _db2.default.Sliders.find({ shopName: req.session.shopName }).populate('products').exec(function (err, sliders) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).send(sliders);
    }
  });
});
apiRouter.route('/sliders/:slider_id');

exports.default = apiRouter;