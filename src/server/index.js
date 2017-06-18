require('dotenv').config({path: path.resolve(`${__dirname}/../../.env`)})
import express from 'express';
import session from 'express-session'
import path from 'path';
import ShopifyToken from 'shopify-token';

const shopifyToken = new ShopifyToken({
  apiKey: process.env.SHOPIFY_APP_API_KEY,
  sharedSecret: process.env.SHOPIFY_APP_SECRET,
  redirectUri: process.env.SHOPIFY_REDIRECT_URI,
})


let app =  express();
app.set('view engine', 'ejs');

app.use(session({secret: 'keyboard cat'}));
app.use(express.static(`${__dirname}/../public`))

// Shopify Authentication
app.get('/install', (req, res)=> {
  res.render(`${__dirname}/../public/install`)
})

// This function initializes the Shopify OAuth Process
// The template in views/embedded_app_redirect.ejs is rendered 
app.get('/shopify_auth', (req, res) => {
  const shop = req.query.shop;
  req.session.shop = req.query.shop;
  if(shop){
    const nonce = shopifyToken.generateNonce();
    const scopes = 'read_products,read_customers,read_orders'
    const authUrl = shopifyToken.generateAuthUrl(shop, scopes, nonce)
    res.render(`${__dirname}/../public/redirect`, { authUrl })
  } else {
    res.status(400).send('Bad request: No shop param specified')
  }
})


// After the users clicks 'Install' on the Shopify website, they are redirected here
// Shopify provides the app the is authorization_code, which is exchanged for an access token
app.get('/callback', (req, res) => {
  const verified = shopifyToken.verifyHmac(req.query);
  console.log(verified)
  if(verified){
    shopifyToken.getAccessToken(req.query.shop, req.query.code).then((token) => {
      req.session.token = token;
      console.log(req.session)
      res.redirect('/');
    }).catch((err) => console.err(err));
  }
})

// React
//The react app handles the rest of the urls
app.get('/', (req, res) => {
  console.log(req.session)
  if (req.session.token) {
    res.render(`${__dirname}/../public/index`, {
      apiKey: process.env.SHOPIFY_APP_API_KEY,
      shopOrigin: req.session.shop
    })
  } else {
    res.redirect('/install');
  }
})


const PORT = process.env.PORT || 3000; 
app.listen(PORT, ()=>{
  console.log(`Listening on port ${PORT}`)
}) 