(function() {
  var categoriesKey = '__categories-cache';
  var categoryKey = '__category-cache';
  var subcategoryKey = '__subcategory-cache';

  var _subcategoryCache = (function(cache) {
    return cache ? JSON.parse(cache) : {};
  })(sessionStorage.getItem(subcategoryKey));

  var _categoryCache = (function(cache) {
    return cache ? JSON.parse(cache) : {};
  })(sessionStorage.getItem(categoryKey));

  var _categoriesCache = (function(cache) {
    return cache ? JSON.parse(cache) : {};
  })(sessionStorage.getItem(categoriesKey));

  if (!window.__services__) window.__services__ = {};

  window.__services__.CategoryService = {
    /**
     * Public getter for a person object
     * @param  {Object} id The id of the person you'd
     * like to fetch
     * @return {Promise}    A promise of the person object
     * by invoking the `.then` method of this promise you
     * will get the data whether from cache or from network
     */
     getCategoriesArr: function(id) {
      return new Promise(function(resolve, reject) {

        if (_categoriesCache.length) {
          resolve(_categoriesCache);
        } else {
          _categoriesCache = fetch(`/api/categories`, {
            credentials: 'same-origin'
          }).then(function(res) {
            if (res.status < 400) {
              return res.json();
            }
            reject();
          }).then(function({categories}) {
            _categoriesCache = categories;
            sessionStorage.setItem(categoriesKey, JSON.stringify(_categoriesCache))
            resolve(_categoriesCache);
          }.bind(this))
          .catch(reject);
        }
      });
    },
     getCategory: function(id) {
      return new Promise(function(resolve, reject) {

        if (_categoryCache[id]) {
          resolve(_categoryCache[id]);
        } else {
          _categoryCache = fetch(`/api/subcategories/${id}`, {
            credentials: 'same-origin'
          }).then(function(res) {
            if (res.status < 400) {
              return res.json();
            }
            reject();
          }).then(function(data) {
            _categoryCache[id] = data;
            sessionStorage.setItem(categoryKey, JSON.stringify(_categoryCache))
            resolve(_categoryCache[id]);
          }.bind(this))
          .catch(reject);
        }
      });
    },
     getSubcategory: function(id) {
      return new Promise(function(resolve, reject) {

        if (_subcategoryCache[id]) {
          resolve(_subcategoryCache[id]);
        } else {
          _subcategoryCache = fetch(`/api/recipes/${id}`, {
            credentials: 'same-origin'
          }).then(function(res) {
            if (res.status < 400) {
              return res.json();
            }
            reject();
          }).then(function(data) {
            _subcategoryCache[id] = data;
            sessionStorage.setItem(subcategoryKey, JSON.stringify(_subcategoryCache))
            resolve(_subcategoryCache[id]);
          }.bind(this))
          .catch(reject);
        }
      });
    },
    //
    // setPersonObj: function(id, data) {
    //   _categoryCache = JSON.parse(JSON.stringify(data));
    //   sessionStorage.setItem('__category-cache', JSON.stringify(_categoryCache))
    //   return _categoryCache;
    // }
};

})();
