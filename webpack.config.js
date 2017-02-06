const path = require('path');

module.exports = {
  entry: './demo/demo.js',
  output: {
    path: './demo',
    filename: 'demo.bundle.js'
  },
  resolve: {
  	modules: [
  	  path.resolve('/usr/local/lib/node_modules')
  	]
  }
};
