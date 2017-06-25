
var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: {
    app:[path.join(__dirname, 'src/client/index.js')],
    vendor: [
      'react',
      'react-dom',
      'react-router-dom',
      '@shopify/polaris',
      '@shopify/polaris/embedded',
      'axios',
    ]
  },
  output: {
    filename: 'bundle.js',
    path: __dirname +'/src/public'
  },
  devtool: 'source-map',
  module:{
    loaders:[
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test:/\.scss$/,
        use: [
          { loader: "style-loader" }, 
          {
            loader: "css-loader",
            options: { minimize: true }
          }, 
          { loader: "sass-loader" }
        ]
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    }),
    new webpack.optimize.CommonsChunkPlugin({name:'vendor', filename:'vendor.bundle.js'}),
  ]
}