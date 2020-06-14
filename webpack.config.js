const path = require('path');
var glob = require("glob");

module.exports = {
  mode: 'development',
  entry: {
    js: glob.sync("./src/public/js/**/*.js"),
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, './src/public/dist/'),
  },
};