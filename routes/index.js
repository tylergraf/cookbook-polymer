var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/category/:categoryId', function(req, res, next) {
  res.render('category', { title: 'Express', categoryId: req.params.categoryId });
});
router.get('/subcategory/:subcategoryId', function(req, res, next) {
  res.render('subcategory', { title: 'Express', subcategoryId: req.params.subcategoryId });
});
router.get('/favorites', function(req, res, next) {
  res.render('favorites');
});
router.get('/recipe/add', function(req, res, next) {
  res.render('add-recipe');
});
router.get('/recipe/:id', function(req, res, next) {
  res.render('recipe', {
    id: req.params.id
  });
});

router.get('/recipe', function(req, res, next) {
  res.render('recipe', {
  _id: "516207e7f51d344e4b6e7ad9",
  _subcategory: "54337b1a5de18b885100001b",
  directions: "<p>Preheat oven to 450. In large bowl mix water, cheese, and bisquick. Spoon Mix onto cookie sheet. Melt butter&ndash;mix with parsley and garlic. Brush over top of biscuits. Bake for 8&ndash;10 minutes.</p>",
  ingredients: ['1 c. Shredded cheese','&frac14; c. Butter','1 c. water','2 c. Bisquick','1 Tbsp. Parsley','&frac12; Tbsp. garlic powder'],
  subcategory_id: "biscuits",
  subtitle: "",
  title: "GARLIC CHEDDAR BISCUITS"
});
});

module.exports = router;
