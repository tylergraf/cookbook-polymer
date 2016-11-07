(function() {
  var called = {
    getCategory: [],
    getFavorite: [],
    getSubcategory: [],
    getRecipe: [],
  };
  const CACHE = {
    exists: key => localStorage[key],
    get: key => {
      try {
        return JSON.parse(localStorage[key]);
      } catch(e){
        console.warn("Couldn't parse key");
      }
    },
    set: (key, data) => {
      localStorage[key] = JSON.stringify(data);
    }
  }
  function getCategories(){
    return function(dispatch){
      const STORAGE_KEY = 'CATEGORIES';

      if(called.getCategories){
        return false;
      }
      var action = {
        type: 'RECEIVE_CATEGORIES'
      };
      if(CACHE.exists(STORAGE_KEY)){
        action.categories = CACHE.get(STORAGE_KEY);
        dispatch(action);
      }
      fb.database().ref('categories').orderByChild('name').on('value', snapshot => {
        called.getCategories = true;
        const categories = [];
        snapshot.forEach(function(child) {
          var obj = child.val();
          obj.id = child.key;
          categories.push(obj);
        });
        CACHE.set(STORAGE_KEY, categories)
        action.categories = categories;
        dispatch(action);
      });
    }
  }
  function getIcons(){
    return function(dispatch){
      const STORAGE_KEY = 'GETICONS';

      if(called.getIcons){
        return false;
      }
      fb.database().ref('icons').orderByChild('name').on('value', snapshot => {
        called.getIcons = true;
        const icons = [];
        snapshot.forEach(function(child) {
          var obj = child.val();
          obj.id = child.key;
          icons.push(obj);
        });
        let action = {
          type: 'RECEIVE_ICONS',
          icons
        };
        dispatch(action);
      });
    }
  }
  function getCategory(id){
    return function(dispatch){
      const STORAGE_KEY = `CATEGORY_${id}`;
      var action = {
        type: 'RECEIVE_CATEGORY'
      };

      if(!id){
        console.error('No id passed');
        return;
      }
      if(called.getCategory[id]){
        return false;
      }
      if(CACHE.exists(STORAGE_KEY)){
        action.category = CACHE.get(STORAGE_KEY);
        action.subcategories = action.category.subcategories;
        dispatch(action);
      }
      called.getCategory.forEach(cid=>{
        fb.database().ref('categories').child(cid).off();
      });
      called.getCategory = [];

      fb.database().ref('categories').child(id).on('value', snapshot => {
        called.getCategory.push(id);
        const category = snapshot.val();
        category.id = snapshot.key;

        action.category = category;
        action.subcategories = category.subcategories;
        CACHE.set(STORAGE_KEY, category);

        dispatch(action);
      });
    }
  };
  function getFavorite(recipeId, userId){
    return function(dispatch){
      const STORAGE_KEY = 'USERID';

      if(!recipeId){
        console.error('No recipeId passed');
        return;
      }
      if(!userId){
        console.error('No userId passed');
        return;
      }
      if(called.getFavorite[`${userId}_${recipeId}`]){
        return false;
      }
      called.getFavorite[`${userId}_${recipeId}`] = true;

      fb.database().ref(`users/${userId}/favorites`).child(recipeId).on('value', snapshot => {
        const recipeId = snapshot.val();
        if(recipeId){

          let action = {
            type: 'RECEIVE_FAVORITE',
            recipeId
          };
          // console.log(action);
          dispatch(action);
        }
      });
    }
  };
  function getFavorites(userId){
    return function(dispatch){
      const STORAGE_KEY = 'USERID';

      if(!userId){
        console.error('No userId passed');
        return;
      }
      if(called.getFavorites){
        return false;
      }
      called.getFavorites = true;

      fb.database().ref(`users/${userId}`).child('favorites').on('value', snapshot => {
        called.getFavorites = false;
        const favorites = [];
        snapshot.forEach(function(child) {
          var obj = child.val();
          obj.id = child.key;
          favorites.push(obj);
        });
        let action = {
          type: 'RECEIVE_FAVORITES',
          favorites
        };
        dispatch(action);
      });
    }
  };
  function getSubcategory(id){
    return function(dispatch){
      const STORAGE_KEY = `SUBCATEGORY${id}`;
      var action = {
        type: 'RECEIVE_SUBCATEGORY'
      };
      if(!id){
        console.error('No id passed');
        return;
      }
      if(called.getSubcategory[id]){
        return false;
      }
      if(CACHE.exists(STORAGE_KEY)){
        action.subcategory = CACHE.get(STORAGE_KEY);
        action.recipes = action.subcategory.recipes;
        dispatch(action);
      }
      called.getSubcategory.forEach(sid=>{
        fb.database().ref('subcategories').child(sid).off();
      });
      called.getSubcategory = [];

      fb.database().ref('subcategories').child(id).on('value', snapshot => {
        called.getSubcategory.push(id);
        const subcategory = snapshot.val();
        subcategory.id = snapshot.key;
        CACHE.set(STORAGE_KEY, subcategory);
        action.subcategory = subcategory;
        action.recipes = subcategory.recipes;

        dispatch(action);
      });
    }
  };

  function getRecipe(id){
    return function(dispatch){
      const STORAGE_KEY = `RECIPE_${id}`;

      if(!id){
        console.error('No id passed');
        return;
      }
      if(called.getRecipe[id]){
        return false;
      }
      var action = {
        type: 'RECEIVE_RECIPE'
      };
      if(CACHE.exists(STORAGE_KEY)){
        action.recipe = CACHE.get(STORAGE_KEY);
        dispatch(action);
      }
      called.getRecipe.forEach(rid=>{
        fb.database().ref('recipes').child(rid).off();
      });
      called.getRecipe = [];

      fb.database().ref('recipes').child(id).on('value', snapshot => {
        called.getRecipe.push(id);
        const recipe = snapshot.val();
        recipe.id = snapshot.key;

        CACHE.set(STORAGE_KEY, recipe)
        action.recipe = recipe;
        dispatch(action);
      });
    }
  };

  function addSubcategory(name, categoryId){
    return function(dispatch){
      const STORAGE_KEY = 'CATEGORYID';

      if(!name){
        console.error('No name passed');
        return;
      }
      if(!categoryId){
        console.error('No categoryId passed');
        return;
      }
      var subcategoryData = {
        name,
        categoryId
      };

      // Get a key for a new Category.
      var newSubcategoryKey = fb.database().ref().child('subcategories').push().key;

      // Write the new post's data simultaneously in the posts list and the user's post list.
      var updates = {};
      updates['/subcategories/' + newSubcategoryKey] = subcategoryData;
      updates[`/categories/${categoryId}/subcategories/${newSubcategoryKey}`] = {name};

      return fb.database().ref().update(updates);
    }
  };

  function updateRecipe(recipe, userId){
    return function(dispatch){
      const STORAGE_KEY = 'USERID';

      if(!recipe){
        console.error('No recipe passed');
        return;
      }
      if(!recipe.id){
        console.error("Recipe doesn't have ID");
        return;
      }
      if(!userId){
        console.error("No Userid passed");
        return;
      }
      if(recipe.userId !== userId){
        console.error("User can't edit this recipe.");
        return;
      }
      // Write the new post's data simultaneously in the posts list and the user's post list.
      var updates = {};
      updates['/recipes/' + recipe.id] = recipe;
      updates[`/subcategories/${recipe.subcategoryId}/recipes/${recipe.id}`] = recipe;
      updates[`/users/${userId}/recipes/${recipe.id}`] = recipe;

      // recipe.favorites.forEach(f=>{
      //   console.log(f);
      // });

      return fb.database().ref().update(updates).then(data=>{
        dispatch({type: 'RECEIVE_RECIPE', recipe});
      });
    }
  };

  function addFavorite(recipeId, subcategoryId, userId){
    return function(dispatch){
      const STORAGE_KEY = 'USERID';

      if(!recipeId){
        console.error('No recipeId passed');
        return;
      }
      if(!subcategoryId){
        console.error('No subcategoryId passed');
        return;
      }
      if(!userId){
        console.error('No userId passed');
        return;
      }
      dispatch({type: 'FAVORITE_RECIPE', recipeId});
      // Get a key for a new Category.
      fb.database().ref(`users/${userId}/favorites/${recipeId}`).set(recipeId)

      var recipeRef = fb.database().ref(`recipes/${recipeId}/favorites`);
      recipeRef.transaction(function (current_value) {
        return (current_value || 0) + 1;
      });
      var subcategoriesRef = fb.database().ref(`/subcategories/${subcategoryId}/recipes/${recipeId}/favorites`);
      subcategoriesRef.transaction(function (current_value) {
        return (current_value || 0) + 1;
      });
      var userRef = fb.database().ref(`users/${userId}/recipes/${recipeId}`);

      userRef.transaction(function (recipe) {
        console.log(recipe);
        if(recipe){
          recipe.favorites += 1;
          return recipe;
        }
      });

    }
  };

  function removeFavorite(recipeId, subcategoryId, userId){
    return function(dispatch){
      const STORAGE_KEY = 'USERID';

      if(!recipeId){
        console.error('No recipeId passed');
        return;
      }
      if(!subcategoryId){
        console.error('No subcategoryId passed');
        return;
      }
      if(!userId){
        console.error('No userId passed');
        return;
      }
      dispatch({type: 'UNFAVORITE_RECIPE', recipeId});

      let action = {
        type: 'RECEIVE_FAVORITE',
        recipeId,
        remove: true
      };
      // console.log(action);
      dispatch(action);
      // Get a key for a new Category.
      fb.database().ref(`users/${userId}/favorites`).child(recipeId).remove();

      var recipeRef = fb.database().ref(`recipes/${recipeId}/favorites`);
      recipeRef.transaction(function (current_value) {
        return (current_value || 0) - 1;
      });
      var subcategoriesRef = fb.database().ref(`/subcategories/${subcategoryId}/recipes/${recipeId}/favorites`);
      subcategoriesRef.transaction(function (current_value) {
        return (current_value || 0) - 1;
      });
      var userRef = fb.database().ref(`users/${userId}/recipes/${recipeId}`);

      userRef.transaction(function (recipe) {
        if(recipe){
          recipe.favorites -= 1;
          return recipe;
        }
      });

    }
  };

  function addRecipe(newRecipe, subcategoryId, userId){
    return function(dispatch){
      const STORAGE_KEY = 'USERID';

      if(!newRecipe){
        console.error('No newRecipe passed');
        return;
      }
      if(!subcategoryId){
        console.error('No subcategoryId passed');
        return;
      }
      if(!userId){
        console.error('No userId passed');
        return;
      }

      var recipeData = Object.assign({
        subcategoryId,
        userId,
        imageUrl: '',
        icon: {},
        color: '',
        directions: [],
        ingredients: [],
        favorites: 0,
        created: new Date().getTime()
      },newRecipe);

      // Get a key for a new Category.
      var newRecipeKey = fb.database().ref().child('recipes').push().key;

      // Write the new post's data simultaneously in the posts list and the user's post list.
      var updates = {};
      updates['/recipes/' + newRecipeKey] = recipeData;
      updates[`/subcategories/${subcategoryId}/recipes/${newRecipeKey}`] = recipeData;
      updates[`/users/${userId}/recipes/${newRecipeKey}`] = recipeData;

      fb.database().ref().update(updates).then((data)=>{
        let action = {
          type: 'RECIPE_ADDED',
          categories,
          userId
        };
        dispatch(action);
      });
    }
  };

  function addIcon(newIcon){
    return function(dispatch){
      const STORAGE_KEY = 'NEWICON';

      if(!newIcon){
        console.error('No newIcon passed');
        return;
      }
      if(!newIcon.name || !newIcon.icon){
        console.error('No newIcon passed');
        return;
      }
      // Get a key for a new icon.
      var newIconKey = fb.database().ref().child('icons').push().key;

      // Write the new post's data simultaneously in the posts list and the user's post list.
      var updates = {};
      updates['/icons/' + newIconKey] = newIcon;

      fb.database().ref().update(updates).then((data)=>{

      });
    }
  };

  function addCategory(name){
    return function(dispatch){
      const STORAGE_KEY = 'NAME';

      if(!name){
        console.error('No name passed');
        return;
      }
      var categoryData = {
        name
      };

      // Get a key for a new Category.
      var newCategoryKey = fb.database().ref().child('categories').push().key;

      // Write the new post's data simultaneously in the posts list and the user's post list.
      var updates = {};
      updates['/categories/' + newCategoryKey] = categoryData;

      return fb.database().ref().update(updates);
    }
  };
  function removeCategory(id){
    return function(dispatch){
      const STORAGE_KEY = 'ID';

      if(!id){
        console.error('No id passed');
        return;
      }
      fb.database().ref('categories').child(id).remove();
    }
  }
  function removeIcon(id){
    return function(dispatch){
      const STORAGE_KEY = 'ID';

      if(!id){
        console.error('No id passed');
        return;
      }
      fb.database().ref('icons').child(id).remove();
    }
  }
  function removeSubcategory(id, categoryId){
    return function(dispatch){
      const STORAGE_KEY = 'CATEGORYID';

      if(!id){
        console.error('No id passed');
        return;
      }
      if(!categoryId){
        console.error('No categoryId passed');
        return;
      }
      fb.database().ref('subcategories').child(id).remove();
      fb.database().ref(`/categories/${categoryId}/subcategories`).child(id).remove();
    }
  }
  function removeRecipe(id, subcategoryId){
    return function(dispatch){
      const STORAGE_KEY = 'SUBCATEGORYID';

      if(!id){
        console.error('No id passed');
        return;
      }
      if(!subcategoryId){
        console.error('No subcategoryId passed');
        return;
      }
      fb.database().ref('recipes').child(id).remove();
      fb.database().ref(`/subcategories/${subcategoryId}/recipes`).child(id).remove();
    }
  }

  window.__actions__ = {
    getCategories,
    getIcons,
    getCategory,
    getSubcategory,
    getRecipe,
    addCategory,
    addSubcategory,
    addRecipe,
    addIcon,
    removeIcon,
    removeCategory,
    removeSubcategory,
    removeRecipe,
    addFavorite,
    getFavorite,
    getFavorites,
    removeFavorite,
    updateRecipe,
  }
})();
