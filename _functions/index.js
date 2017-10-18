var functions = require('firebase-functions');
var fetch = require('node-fetch');

exports.api = functions.https.onRequest((request, response) => {
  let path = request.path;
  console.log('request.path: ',request.path);
  console.log('path: ',path);
  // TODO(dfreedm): is there some static prop we can use?
  let query = '';
  for (let p in request.query) {
    query = query || '?';
    query += `${p}=${request.query[p]}`;
  }
  let url = `https://gretchenscookbook-api.herokuapp.com/api${path}${query}`;
  fetch(url)
    .then(res => res.json())
    .then(json=>{
      response.set('Cache-Control', 'public, max-age=600, s-maxage=600');
      response.send(json);
    })
    .catch(err=>{
      response.statusCode = err.status || 500;
      response.send('An error occurred.')
    });
});
