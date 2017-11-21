window._fetch = ((url, method = 'get', body) => {
  if(method === 'get'){
    return new Promise((resolve, reject) => {
      var request = new XMLHttpRequest();
      request.onerror = reject;
      request.onload = () => resolve({
        json: () => Promise.resolve(request.responseText).then(JSON.parse),
      });
      request.open('get', url);
      request.send();
    })
    .then(res=>res.json());
  }
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
