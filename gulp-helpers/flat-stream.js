var through = require('through2');
var flat = require('./flat-imports');

function flatStream(){
  var stream = through.obj(function(file, enc, cb) {
    if (file.isStream()) {
      this.emit('error', new PluginError('flatImports', 'Streams are not supported!'));
    }

    var paths = flat.flatImports(file);

    var preloads = paths.preloads.map((path)=>`<link rel="preload" href="${path}" as="script">`);
    var imports = paths.imports.map((path)=>`<link rel="import" href="${path}">`);
    var inerts = paths.inerts.map((path)=>`<link rel="inert" href="${path}">`);

    var links = preloads.join('\n');
    links+= '\n\n'+imports.join('\n');
    links+= '\n\n'+inerts.join('\n');

    file.contents = new Buffer(links, "utf-8");

    this.push(file);

    cb();
  });

  return stream;
}
module.exports = flatStream;
