var through = require('through2');
var flat = require('./flat-imports');
var fs = require('fs');
var path = require('path');
var dom5 = require('dom5');
var pred = dom5.predicates;

var importsQuery = pred.AND(
  pred.hasTagName('link'),
  pred.hasAttrValue('rel', 'import'),
  pred.hasAttr('href')
);
var preloadsQuery = pred.AND(
  pred.hasTagName('link'),
  pred.hasAttrValue('rel', 'preload'),
  pred.hasAttr('href')
);

module.exports = function() {
  return through.obj(function(file, encoding, callback) {
    if (file.isNull()) {
           // nothing to do
           return callback(null, file);
       }

       if (file.isStream()) {
           // file.contents is a Stream - https://nodejs.org/api/stream.html
           this.emit('error', new PluginError(PLUGIN_NAME, 'Streams not supported!'));

           // or, if you can handle Streams:
           //file.contents = file.contents.pipe(...
           //return callback(null, file);
       } else if (file.isBuffer()) {

         var contents = fs.readFileSync(path.join(__dirname,'/../builtBundles/my-app.html'), 'utf-8');
         var imports = [];
         var preloads = [];

         var dom = dom5.parse(contents);

         dom5.queryAll(dom, importsQuery)
             .forEach(function(node) {
               var relativePath = dom5.getAttribute(node, 'href');
               imports.push(relativePath);

             });
         dom5.queryAll(dom, preloadsQuery)
             .forEach(function(node) {
               var relativePath = dom5.getAttribute(node, 'href');
               preloads.push(relativePath);
             });

          imports = imports.map(p=>`<${p}>;rel=preload;as=html`);
          preloads = preloads.map(p=>`<${p}>;rel=preload;as=script`);

          imports = imports.splice(0,30);
          var val = preloads.join(',')+','+imports.join(',');

          var fbFile = JSON.parse(file.contents);
          fbFile.hosting.headers[0].headers[0].value = val;

          file.contents = new Buffer(JSON.stringify(fbFile, null, 2), "utf-8");

          return callback(null, file);
       }
  });
};
