// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

// allow command line override of connected library path, e.g.
// $ LIBRARY=http://localhost:8080/library npm run dev
var library = process.env.LIBRARY || 'http://localhost:8080'
var splitRegExp = new RegExp(
        '^' +
            '(?:' +
            '([^:/?#.]+)' +                         // scheme - ignore special characters
                                                    // used by other URL parts such as :,
                                                    // ?, /, #, and .
            ':)?' +
            '(?://' +
            '(?:([^/?#]*)@)?' +                     // userInfo
            '([\\w\\d\\-\\u0100-\\uffff.%]*)' +     // domain - restrict to letters,
                                                    // digits, dashes, dots, percent
                                                    // escapes, and unicode characters.
            '(?::([0-9]+))?' +                      // port
            ')?' +
            '([^?#]+)?' +                           // path
            '(?:\\?([^#]*))?' +                     // query
            '(?:#(.*))?' +                          // fragment
            '$');
var split = library.match(splitRegExp)
var splitpath = split[5] || ''
var ppath = splitpath
// console.log(split);
// console.log(ppath);
var ops={
    target: library,
    secure: false,
    changeOrigin: true,
    onProxyRes(proxyRes, req, res) {
      // proxyRes.headers['Set-Cookie']=proxyRes.headers['set-cookie'];
      var existingCookies = proxyRes.headers['set-cookie'];
      var rewrittenCookies = [];
      if (existingCookies !== undefined) {
        if (!Array.isArray(existingCookies)) {
          existingCookies = [existingCookies];
        }
        for (let i = 0; i < existingCookies.length; i++) {
          var re = /ath=(.*);/;
          var match=existingCookies[i].match(re);
          if(match!=null){
              rewrittenCookies.push(existingCookies[i].replace(match[1], "/"));
          }else{
            rewrittenCookies.push(existingCookies[i]);
          }

        }
        proxyRes.headers['set-cookie'] = rewrittenCookies;
      }
      Object.keys(proxyRes.headers).forEach(function (key) {
        var newkey = key.replace(/((?:^|-)[a-z])/g, function(val) { return val.toUpperCase(); });
        // custom hack for X-Parse-Os-Version ==> X-Parse-OS-Version
        newkey = newkey.replace(/(-Os-)/g, function(val) { return val.toUpperCase(); });
        proxyRes.headers[newkey] = proxyRes.headers[key];

        res.append(newkey, proxyRes.headers[newkey]);
      });
    },
    onProxyReq(proxyReq, req, res) {
      Object.keys(req.headers).forEach(function (key) {
        proxyReq.setHeader(key, req.headers[key]);
      });
    }
  }

module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '',
    productionSourceMap: true,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  },
  dev: {
    env: require('./dev.env'),
    port: 3000,
    autoOpenBrowser: true,
    contentBase: path.join(__dirname, "dist"),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    //    proxy each backend api route separately, rewrites not needed
	  proxyTable: {
    //    '/user':ops,
    //    '/login':ops,
    //    '/logout':ops,
    //    '/knowledgeObject':ops,
    //    '/info':ops
    },
	// CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  }
}
