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

var _shop = require('./shop');

var _shop2 = _interopRequireDefault(_shop);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('dotenv').config({ path: _path2.default.resolve(__dirname + '/../../.env') });

var FileStore = require('session-file-store')(_expressSession2.default);

var shopifyToken = new _shopifyToken2.default({
  apiKey: process.env.SHOPIFY_APP_API_KEY,
  sharedSecret: process.env.SHOPIFY_APP_SECRET,
  redirectUri: process.env.SHOPIFY_REDIRECT_URI
});

console.log('__dirname-----------------');
console.log(__dirname);

var app = (0, _express2.default)();
app.set('view engine', 'ejs');

app.use((0, _morgan2.default)('dev'));
app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({ extended: false }));
app.use((0, _cookieParser2.default)());
app.use((0, _expressSession2.default)({
  store: new FileStore({
    reapInterval: -1
  }),
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}));
app.use(_express2.default.static(__dirname + '/../public')

// Shopify Authentication
);app.get('/install', function (req, res) {
  res.render(__dirname + '/views/install.ejs');
}

// This function initializes the Shopify OAuth Process
// The template in views/embedded_app_redirect.ejs is rendered 
);app.get('/shopify_auth', function (req, res) {
  var shop = req.query.shop;
  if (shop) {
    req.session.shop = req.query.shop;
    var nonce = shopifyToken.generateNonce();
    var scopes = process.env.SHOPIFY_APP_SCOPES;
    var authUrl = shopifyToken.generateAuthUrl(shop, scopes, nonce);
    res.render(__dirname + '/views/redirect.ejs', { authUrl: authUrl });
  } else {
    res.status(400).send('Bad request: No shop param specified');
  }
}

// After the users clicks 'Install' on the Shopify website, they are redirected here
// Shopify provides the app the is authorization_code, which is exchanged for an access token
);app.get('/callback', function (req, res) {
  var verified = shopifyToken.verifyHmac(req.query);
  console.log(verified);
  if (verified) {
    shopifyToken.getAccessToken(req.query.shop, req.query.code).then(function (token) {
      req.session.token = token;
      console.log(req.session);
      res.redirect('/');
    }).catch(function (err) {
      return console.err(err);
    });
  }
}

// React
//The react app handles the rest of the urls
);app.get('/', function (req, res) {
  console.log(req.session);
  if (req.session.token) {

    var shop = new _shop2.default(req.session.shop, req.session.token);
    //shop.addWebhook()

    shop.addScriptTag();

    res.render(__dirname + '/views/index.ejs', {
      apiKey: process.env.SHOPIFY_APP_API_KEY,
      shopOrigin: req.session.shop
    });
  } else {
    res.redirect('/install');
  }
});

app.post('/webhook/:hook', function (req, res) {
  console.log(req.body);
  res.status(200).send('ok');
});

app.get('/proxy/products/', function (req, res) {
  console.log(req.session);
  res.set('Content-Type', 'application/liquid');
  res.render(__dirname + '/views/proxy.ejs');
});

var PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log('Listening on port ' + PORT);
});