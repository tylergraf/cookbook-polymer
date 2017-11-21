var functions = require('firebase-functions');
var fetch = require('node-fetch');

var categories = [{"_id":"54336eddd270b09c50000017","__v":0,"name":"Appetizers","slug":"appetizers","recipeCount":2,"updated":"2014-10-07T04:41:01.825Z","created":"2014-10-07T04:41:01.825Z"},{"_id":"54336eddd270b09c50000018","__v":0,"name":"Breads","slug":"breads","recipeCount":15,"updated":"2014-10-07T04:41:01.825Z","created":"2014-10-07T04:41:01.825Z"},{"_id":"54336eddd270b09c5000001b","__v":0,"name":"Drinks","slug":"drinks","recipeCount":20,"updated":"2014-10-07T04:41:01.825Z","created":"2014-10-07T04:41:01.825Z"},{"_id":"54336eddd270b09c50000019","__v":0,"name":"Breakfast","slug":"breakfast","recipeCount":0,"updated":"2014-10-07T04:41:01.825Z","created":"2014-10-07T04:41:01.825Z"},{"_id":"54336eddd270b09c5000001d","__v":0,"name":"Miscellaneous","slug":"miscellaneous","recipeCount":0,"updated":"2014-10-07T04:41:01.826Z","created":"2014-10-07T04:41:01.826Z"},{"_id":"54336eddd270b09c5000001e","__v":0,"name":"Salads","slug":"salads","recipeCount":33,"updated":"2014-10-07T04:41:01.826Z","created":"2014-10-07T04:41:01.826Z"},{"_id":"54336eddd270b09c5000001a","__v":0,"name":"Desserts","slug":"desserts","recipeCount":12,"updated":"2014-10-07T04:41:01.825Z","created":"2014-10-07T04:41:01.825Z"},{"_id":"54336eddd270b09c5000001c","__v":0,"name":"Main Dishes","slug":"main-dishes","recipeCount":8,"updated":"2014-10-07T04:41:01.825Z","created":"2014-10-07T04:41:01.825Z"},{"_id":"54336eddd270b09c5000001f","__v":0,"name":"Soups","slug":"soups","recipeCount":27,"updated":"2014-10-07T04:41:01.826Z","created":"2014-10-07T04:41:01.826Z"}];

exports.api = functions.https.onRequest((request, response) => {
  let {method} = request;

  if(method === 'GET'){
    response.set('Cache-Control', 'public, max-age=600, s-maxage=600');
    return response.send(categories);
  }
  if(method === 'POST'){
    console.log('body',request.body);
    categories = JSON.parse(request.body);
    response.set('Cache-Control', 'public, max-age=600, s-maxage=600');
    return response.send(categories);
  }
  response.statusCode = 400;
  response.send('Bad method');
});
