window._fetch = ((url, method = 'get', body) => {
  if(typeof firebase === 'undefined'){
    return fetchData(url, method, body);
  }
  if(!firebase.auth().currentUser){
    return fetchData(url, method, body);
  }
  return firebase.auth().currentUser.getIdToken()
    .then(idToken=>{
      return fetchData(url,method,body,idToken);
    });

});

window.fetchData = ((url, method = 'get', body, idToken = '') => {
  if(method === 'get'){
    return new Promise((resolve, reject) => {
      var request = new XMLHttpRequest();
      request.onerror = reject;
      request.onload = () => {
        if(request.status === 404){
          return reject(404);
        }
        resolve({
          json: () => Promise.resolve(request.responseText).then(JSON.parse),
        });
      }
      request.open('get', url);
      request.setRequestHeader('authorization', `Bearer ${idToken}`);
      request.send();
    })
    .then(res=>res.json());
  }
  var options = {
    method: method,
    headers: {
      'content-type': 'application/json',
      'accept': 'application/json',
      'authorization': `Bearer ${idToken}`
    }
  };
  if(body){
    options.body = JSON.stringify(body);
  }
  return fetch(url, options)
    .then(res=>{
      if(res.status === 204){
        return Promise.resolve();
      }
      return res.json()
    });
});
