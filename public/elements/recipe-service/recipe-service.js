(function() {

  var _cache = (function(cache) {
    return cache ? JSON.parse(cache) : {};
  })(sessionStorage.getItem('__recipe-cache'));

  if (!window.__services__) window.__services__ = {};

  window.__services__.RecipeService = {
    /**
     * Public getter for a person object
     * @param  {Object} id The id of the person you'd
     * like to fetch
     * @return {Promise}    A promise of the person object
     * by invoking the `.then` method of this promise you
     * will get the data whether from cache or from network
     */
     getRecipeObj: function(id) {
      return new Promise(function(resolve, reject) {
        if (_cache[id]) {
          resolve(_cache[id]);
        } else {
          _cache[id] = fetch(`/api/recipe/${id}`)
          .then(function(res) {
            if (res.status < 400) {
              return res.json();
            }
            reject();
          }).then(function({recipe}) {
            _cache[id] = recipe;
            sessionStorage.setItem('__recipe-cache', JSON.stringify(_cache))
            resolve(_cache[id]);
          }.bind(this))
          .catch(reject);
        }
      });
    },
    //
    // setPersonObj: function(id, data) {
    //   _cache[id] = JSON.parse(JSON.stringify(data));
    //   sessionStorage.setItem('__recipe-cache', JSON.stringify(_cache))
    //   return _cache[id];
    // }
};

})();
