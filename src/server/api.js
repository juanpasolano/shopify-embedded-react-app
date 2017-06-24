import express from 'express';
import async from 'async';
import db from './db';

var apiRouter = express.Router();   
apiRouter.route('/sliders')
  .post((req, res) => {


    const slider = new db.Sliders({
      name: req.body.name,
      shopName: req.session.shopName
    })


    async.each((req.body.products || []), (product, cb) => {
      db.Products.findOne({shopifyId: product.id}, (err, foundProduct) => {
        if(!foundProduct) {
          //createit
          const newProduct = new db.Products({
            data: product,
            shopifyId: product.id,
          })
          newProduct.save()
          slider.products.push(newProduct)
          cb(err);
        } else {
          //push
          slider.products.push(foundProduct)
          cb(err);
        }
      })
    }, (err) => {
      slider.save((err, slider) => {
        if(err){
          res.status(400).send(err)
        } else {
          res.status(200).send(slider)
        }
      })
    })
  })
  .get((req,res) => {
    db.Sliders
    .find({shopName:req.session.shopName})
    .populate('products')
    .exec((err, sliders) => {
      if(err){
        res.status(400).send(err)
      }else{
        res.status(200).send(sliders)
      }
    })
  })
apiRouter.route('/sliders/:slider_id')
  .delete((req,res) => {
    const sliderId = req.params.slider_id;
    db.Sliders
    .findByIdAndRemove(sliderId, (err, slider) => {
      if(err){
        res.status(400).send(err)
      }else{
        res.status(200).send(slider)
      }
    })
  })

export default apiRouter