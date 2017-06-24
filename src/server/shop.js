import Shopify from 'shopify-api-node';

function Shop(shopName, token) {
  this.shopName = shopName;
  this.token = token;
  this.shopify = new Shopify({
    shopName: this.shopName,
    accessToken: this.token
  })

  //path ie '/products-create'
  //topic ie 'products/create'
  this.addWebhook = (path, topic) => {
    if (process.env.BASE_URL){
      const address = `${process.env.BASE_URL}webhook/${path}`
      return this.shopify.webhook.create({ 
        topic: topic,
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