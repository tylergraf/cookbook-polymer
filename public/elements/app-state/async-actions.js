(function() {
  var called = {
    getCategory: [],
    getFavorite: [],
  };

  function getCategories(){
    return function(dispatch){
      if(called.getCategories){
        return false;
      }
      fb.database().ref('categories').orderByChild('name').on('value', snapshot => {
        called.getCategories = true;
        const categories = [];
        snapshot.forEach(function(child) {
          var obj = child.val();
          obj.id = child.key;
          categories.push(obj);
        });
        let action = {
          type: 'RECEIVE_CATEGORIES',
          categories
        };
        dispatch(action);
      });
    }
  }
  function getIcons(){
    return function(dispatch){
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
      if(!id){
        console.error('No id passed');
        return;
      }
      if(called.getCategory[id]){
        return false;
      }
      called.getCategory.forEach(cid=>{
        fb.database().ref('categories').child(cid).off();
      });
      called.getCategory = [];

      fb.database().ref('categories').child(id).on('value', snapshot => {
        called.getCategory[id] = true;
        const category = snapshot.val();
        category.id = snapshot.key;
        let action = {
          type: 'RECEIVE_CATEGORY',
          category,
          subcategories: category.subcategories
        };
        // console.log(action);
        dispatch(action);
      });
    }
  };
  function getFavorite(recipeId, userId){
    return function(dispatch){
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
  function getSubcategory(id){
    return function(dispatch){
      if(!id){
        console.error('No id passed');
        return;
      }
      if(called.getSubcategory){
        return false;
      }

      fb.database().ref('subcategories').child(id).on('value', snapshot => {
        called.getSubcategory = true;
        const subcategory = snapshot.val();
        subcategory.id = snapshot.key;
        let action = {
          type: 'RECEIVE_SUBCATEGORY',
          subcategory,
          recipes: subcategory.recipes
        };
        dispatch(action);
      });
    }
  };

  function addSubcategory(name, categoryId){
    return function(dispatch){
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

  function addFavorite(recipeId, subcategoryId, userId){
    return function(dispatch){
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
        favorites: 0
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
      if(!newIcon){
        console.error('No newIcon passed');
        return;
      }
      if(!newIcon.name || !newIcon.imageUrl){
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
      if(!id){
        console.error('No id passed');
        return;
      }
      fb.database().ref('categories').child(id).remove();
    }
  }
  function removeSubcategory(id, categoryId){
    return function(dispatch){
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
    addCategory,
    addSubcategory,
    addRecipe,
    addIcon,
    removeCategory,
    removeSubcategory,
    removeRecipe,
    addFavorite,
    getFavorite,
    removeFavorite,
  }
})();
