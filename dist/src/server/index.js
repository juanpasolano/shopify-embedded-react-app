'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _expressSession = require('express-session');

var _expressSession2 = _interopRequireDefault(_expressSession);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _cookieParser = require('cookie-parser');

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _shopifyToken = require('shopify-token');

var _shopifyToken2 = _interopRequireDefault(_shopifyToken);

var _ejs = require('ejs');

var _ejs2 = _interopRequireDefault(_ejs);

var _shop = require('./shop');

var _shop2 = _interopRequireDefault(_shop);

var _db = require('./db');

var _db2 = _interopRequireDefault(_db);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _api = require('./api');

var _api2 = _interopRequireDefault(_api);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('dotenv').config({ path: _path2.default.resolve(__dirname + '/../../.env') });

var MongoStore = require('connect-mongo')(_expressSession2.default);

//Setting up Shopify App Credentials
var shopifyToken = new _shopifyToken2.default({
  apiKey: process.env.SHOPIFY_APP_API_KEY,
  sharedSecret: process.env.SHOPIFY_APP_SECRET,
  redirectUri: process.env.SHOPIFY_REDIRECT_URI
});

//The express app
var app = (0, _express2.default)();
app.set('view engine', 'ejs');

app.use((0, _morgan2.default)('dev'));
app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({ extended: false }));
app.use((0, _cookieParser2.default)());
app.use((0, _expressSession2.default)({
  store: new MongoStore({ mongooseConnection: _mongoose2.default.connection }),
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}));
app.use(_express2.default.static(__dirname + '/../public'));

// Shopify Authentication
app.get('/install', function (req, res) {
  res.render(__dirname + '/views/install.ejs');
});

// This function initializes the Shopify OAuth Process
// The template in views/embedded_app_redirect.ejs is rendered 
app.get('/shopify_auth', function (req, res) {
  var shop = req.query.shop;
  if (shop) {
    req.session.shopName = shop;
    var nonce = shopifyToken.generateNonce();
    var scopes = process.env.SHOPIFY_APP_SCOPES;
    var authUrl = shopifyToken.generateAuthUrl(shop, scopes, nonce);
    res.render(__dirname + '/views/redirect.ejs', { authUrl: authUrl });
  } else {
    res.status(400).send('Bad request: No shop param specified');
  }
});

// After the users clicks 'Install' on the Shopify website, they are redirected here
// Shopify provides the app the is authorization_code, which is exchanged for an access token
app.get('/callback', function (req, res) {
  var verified = shopifyToken.verifyHmac(req.query);
  if (verified) {
    shopifyToken.getAccessToken(req.query.shop, req.query.code).then(function (token) {
      req.session.token = token;

      var shop = new _shop2.default(req.session.shopName, req.session.token);
      shop.addWebhook('products-update', 'products/update');
      shop.addScriptTag('scriptTag');

      res.redirect('/');
    }).catch(function (err) {
      return console.err(err);
    });
  }
});

// React
//The react app handles the rest of the urls
app.get('/', function (req, res) {
  if (req.session.token) {
    res.render(__dirname + '/views/index.ejs', {
      apiKey: process.env.SHOPIFY_APP_API_KEY,
      shopName: req.session.shopName
    });
  } else {
    res.redirect('/install');
  }
});

//Handles the hooks from shopify
app.post('/webhook/:hook', function (req, res) {
  if (req.params.hook === 'products-update') {
    _db2.default.Products.update({ shopifyId: req.body.id }, { data: req.body }, function (err, product) {
      if (err) {
        res.status(400).send('ok');
      } else {
        res.status(200).send(product);
      }
    });
  } else {
    res.status(200).send('ok');
  }
});

app.get('/proxy/products/', function (req, res) {
  res.set('Content-Type', 'application/liquid');
  res.render(__dirname + '/views/proxy.ejs');
});

//The script served to the shop
app.get('/scriptTag', function (req, res) {
  if (req.query.shop) {
    var shopName = req.query.shop.replace('.myshopify.com', '');
    _db2.default.Sliders.find({ shopName: shopName }).populate('products').exec(function (err, sliders) {
      res.contentType('application/javascript');
      res.render(__dirname + '/views/scriptTag.ejs', { sliders: sliders });
    });
  } else {
    res.contentType('application/javascript');
    res.render(__dirname + '/views/scriptTag.ejs');
  }
});

//Routes as api for react

app.use('/api', _api2.default);

var PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log('Listening on port ' + PORT);
});