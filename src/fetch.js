window._fetch = ((url, method = 'get', body) => {
  var options = {
    method: method,
    headers: {
      'content-type': 'application/json',
      'accept': 'application/json'
    }
  };
  if(body){
    options.body = JSON.stringify(body);
  }
  return fetch(url, options)
    .then(res=>res.json());
});
