var fs = require('fs');
var Path = require('path');
var dom5 = require('dom5');
var pred = dom5.predicates;
var relative = require('relative');
var root = new RegExp(process.cwd().replace('/', '\/') + '\/[^\/]*');

// Query for finding `link` tags will be filtered for only
// HTML hrefs
var linkTagQuery = pred.AND(
  pred.hasTagName('link'),
  pred.hasAttrValue('rel', 'import'),
  pred.hasAttr('href')
);
var inertQuery = pred.AND(
  pred.hasTagName('link'),
  pred.hasAttrValue('rel', 'inert'),
  pred.hasAttr('href')
);
var scriptQuery = pred.AND(
  pred.hasTagName('script'),
  pred.hasAttr('src')
);

function parsePath(path) {
  var extname = Path.extname(path);
  return {
    dirname: Path.dirname(path),
    basename: Path.basename(path, extname),
    extname: extname
  };
}


function imports(filePath, paths) {
  var contents;
  try {
    console.log(filePath);
    contents = fs.readFileSync(filePath, 'utf-8');
  } catch(err){
    if(err && err.code && err.code === 'ENOENT'){
      try {
        filePath = filePath.replace('assets','components');
        contents = fs.readFileSync(filePath, 'utf-8')
      } catch(err){}
    }
  }
  if(!contents) return paths;

  var dom = dom5.parse(contents);

  dom5.queryAll(dom, linkTagQuery)
      .forEach(function(node) {
        var relativePath = dom5.getAttribute(node, 'href');
        var path = resolveRelativePath(filePath, relativePath);
        if(path.includes('typography') || path.includes('roboto')){
          return;
        }
        paths.imports.push(path);
        path = 'src'+path;

        imports(path, paths);
      })

  dom5.queryAll(dom, scriptQuery)
      .forEach(function(node) {
        var relativePath = dom5.getAttribute(node, 'src');
        var path = resolveRelativePath(filePath, relativePath);

        paths.preloads.push(path);

      });

  dom5.queryAll(dom, inertQuery)
      .forEach(function(node) {
        var relativePath = dom5.getAttribute(node, 'href');
        var path = resolveRelativePath(filePath, relativePath);

        paths.inerts.push(path);

      });

  return paths;

}

function resolveRelativePath(file, path) {

  if(file.startsWith('components')){
    file= '/'+file;
  }
  var parsedFile = parsePath(file);
  var parsedPath = parsePath(path);

  path = Path.resolve(parsedFile.dirname, parsedPath.dirname, parsedPath.basename + parsedPath.extname).replace(root, '');

  return path;
}

function flatImports(file){
  console.log(file.path);
  var paths = imports(file.path, {imports:[],inerts:[],preloads:[]});

  paths.preloads = paths.preloads.filter((v, i, a) => a.indexOf(v) === i);
  paths.imports = paths.imports.filter((v, i, a) => a.indexOf(v) === i);
  paths.inerts = paths.inerts.filter((v, i, a) => a.indexOf(v) === i);

  return paths;
}

module.exports = {
  flatImports,
  imports
};
