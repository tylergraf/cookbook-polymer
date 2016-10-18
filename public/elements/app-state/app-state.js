(function() {
  var initialState = {
    category: {},
    categories: [],
    subcategories: [],
    favorites: [],
    newRecipe: {}
  };
  function reducer(state, action){
    switch (action.type) {
      case 'SET_RECIPE_IMAGE':
        state.newRecipe.imageUrl = action.url;
        break;
      case 'FAVORITE_RECIPE':
        state.loading = true;
        break;
      case 'UNFAVORITE_RECIPE':
        state.loading = true;
        break;
      case 'RECEIVE_FAVORITE':
        state.loading = false;
        if(action.remove){
          state.favorites = state.favorites.filter(f=>f!==action.recipeId);
        } else {
          state.favorites = state.favorites.concat([action.recipeId]);
        }
        break;
      case 'SET_USER':
        state.user = action.user;
        break;
      case 'SELECT_CATEGORY':
        state.categoryId = action.categoryId;
        break;
      case 'SELECT_SUBCATEGORY':
        if(action.subcategoryId){
          state.subcategoryId = action.subcategoryId;
        }
        break;
      case 'RECEIVE_CATEGORIES':
        state.categories = action.categories;
        break;
      case 'RECEIVE_ICONS':
        state.icons = action.icons;
        break;
      case 'RECEIVE_CATEGORY':
        state.subcategoryId = null;
        state.subcategories = [];
        if(action.subcategories){
          state.subcategories = toArray(action.subcategories);
        }
        state.category = Object.assign({}, action.category);
        break;
      case 'RECEIVE_SUBCATEGORY':
        if(action.recipes){
          state.recipes = toArray(action.recipes);
        }
        state.subcategory = Object.assign({}, action.subcategory);
        break;
      case 'RECIPE_ADDED':
        state.recipeAdded = true;
        break;
      default:

    }
    return state;
  }

  function toArray(obj) {
    var arr = Object.keys(obj).map(function(key) {
      var cd = Object.assign(obj[key], {id: key});
      return cd;
    });
    return arr;
  };

  var compose = Redux.compose;
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  var store = Redux.createStore(reducer, initialState, composeEnhancers(Redux.applyMiddleware(ReduxThunk.default)));
  window.__state__ = PolymerRedux(store);
})();
