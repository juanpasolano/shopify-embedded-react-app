import Shopify from 'shopify-api-node';

function Shop(shop, token) {
  this.shop = shop;
  this.token = token;
  this.shopify = new Shopify({
    shopName: this.shop,
    accessToken: this.token
  })
  this.addWebhook = () => {
    if (process.env.BASE_URL){
      const address = `${process.env.BASE_URL}webhook/products-create`
      return this.shopify.webhook.create({ 
        topic: 'products/create',
        address
      }).then(res => console.log(res))
        .catch(err => console.error(err));
    }
  }
  this.addScriptTag = () => {
    return this.shopify.scriptTag.create({ 
      event: "onload",
      src: `${process.env.BASE_URL}scriptTag.js`
    }).then(res => console.log(res))
      .catch(err => console.error(err));
  }
}
export default Shop;