var through = require('through2');    // npm install --save through2

module.exports = function() {
  return through.obj(function(file, encoding, callback) {
    if (file.isNull()) {
           // nothing to do
           return callback(null, file);
       }

       if (file.isStream()) {
         console.log('stream');
           // file.contents is a Stream - https://nodejs.org/api/stream.html
           this.emit('error', new PluginError(PLUGIN_NAME, 'Streams not supported!'));

           // or, if you can handle Streams:
           //file.contents = file.contents.pipe(...
           //return callback(null, file);
       } else if (file.isBuffer()) {
         console.log('buffer');
         console.log(file.contents);
           // or, if you can handle Buffers:
           //file.contents = ...
           return callback(null, file);
       }
  });
};
