(function() {
  var initialMainState = {
    category: {},
    categories: [],
    subcategories: [],
    favorites: [],
    recipes: [],
    recipeObjs: {},
    newRecipe: {},
    user: null,
    saved: null,
    iconPickerOpen: false,
    searchBarOpen: false,
    categoryId: '',
    subcategoryId: '',
  };
  function reducer(state = {}, action){
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
        state.user = Object.assign({}, action.user);
        break;
      case 'SET_USER_ADMIN':
        if(action.admin){
          state.user = Object.assign(state.user, {admin: action.admin});
        }
        break;
      case 'UNSET_USER':
        state.user = null;
        break;
      case 'SET_RECIPE_COLOR':
        state.recipes = state.recipes.map(recipe=>{
          var newRecipe = Object.assign({}, recipe);
          if(action.recipe.id === newRecipe.id){
            newRecipe.color = action.color;
          }
          return newRecipe;
        });
        break;
      case 'SET_RECIPE_ICON':
        state.recipes = state.recipes.map(recipe=>{
          var newRecipe = Object.assign({}, recipe);
          if(action.recipe.id === newRecipe.id){
            newRecipe.icon = action.icon;
          }
          return newRecipe;
        });
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
      case 'RECEIVE_FAVORITES':
        state.favorites = action.favorites;
        break;
      case 'RECEIVE_ICONS':
        state.icons = action.icons;
        break;
      case 'RECEIVE_CATEGORY':
        state.subcategories = [];
        if(action.subcategories){
          state.subcategories = toArray(action.subcategories);
        }
        state.category = Object.assign({}, action.category);
        break;
      case 'RECEIVE_SUBCATEGORY':
        if(action.recipes){
          var recipes = toArray(action.recipes);
          recipes = recipes.map(r=>{
            r.favorites = toArray(r.favorites);
            return r;
          });
          state.recipes = recipes;
        }
        state.subcategory = Object.assign({}, action.subcategory);
        break;
      case 'RECEIVE_RECIPE':
        action.recipe.favorites = toArray(action.recipe.favorites);

        state.recipeObjs[action.recipe.id] = action.recipe;
        break;
      case 'RECIPE_SAVED':
        state.saved = Object.assign({},action.recipe);
        break;
      case 'CLEAR_SAVED':
        state.saved = null;
        break;
      case 'NAVIGATE':
        state.navigate = action.href;
        break;
      case 'CLEAR_NAVIGATION':
        state.navigate = '';
        break;
      case 'ALERT':
        state.alert = Object.assign({}, {type:action.type, message: action.message});
        break;
      case 'CLEAR_ALERT':
        state.alert = {};
        break;
      case 'TOGGLE_ICON_PICKER':
        state.iconPickerOpen = action.open;
        break;
      case 'SET_CATEGORY':
        state.categoryId = action.categoryId;
        break;
      case 'SET_SUBCATEGORY':
        state.subcategoryId = action.subcategoryId;
        break;
      case 'SET_SEARCH_QUERY':
        state.searchQuery = action.query;
        break;
      case 'RECEIVE_SEARCH_RESULTS':
        state.recipes = action.results.hits.map(r=>({id: r._id}));
        break;
      case 'SET_SEARCH_BAR_OPEN':
        state.searchBarOpen = action.showing;
        break;
      default:

    }
    return state;
  }

  function toArray(obj) {
    if(!obj) return [];

    var arr = Object.keys(obj).map(function(key) {
      var cd;
      if(typeof obj[key] === 'string'){
        cd = {id: key, value: obj[key]};
      } else {
        cd = Object.assign(obj[key], {id: key});
      }
      return cd;
    });
    return arr;
  };

  var initialIconState = {
    color: 'white',
    icon: {
      icon: "cookbook:fruit-1",
      id: "-KVV3n9GkzrAPBFHl3OQ",
      name: "apple"
    }
  };

  function iconReducer(state = {}, action) {
    switch (action.type) {
      case 'SET_ICON_COLOR':
        if(action.color){
          state.color = action.color;
        }
        if(action.icon){
          state.icon = Object.assign({},action.icon);
        }
        break;
      default:

    }
    return state;
  }

  var initialRecipeState = {

  };

  function recipeReducer(state = {}, action) {
    switch (action.type) {
      case 'RECEIVE_RECIPE':
        if(action.color){
          state.color = action.color;
        }
        if(action.icon){
          state.icon = Object.assign({},action.icon);
        }
        break;
      default:

    }
    return state;
  }
  var compose = Redux.compose;
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  const rootReducer = Redux.combineReducers({
    icon: iconReducer,
    main: reducer,
    // recipe: recipeReducer
  });

  const initialState = {
    icon: initialIconState,
    main: initialMainState,
    // recipe: {}
  };

  var store = Redux.createStore(rootReducer, initialState, composeEnhancers(Redux.applyMiddleware(ReduxThunk.default)));
  window.ReduxMixin = PolymerRedux(store);
})();
