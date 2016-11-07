var express = require('express');
var router = express.Router();

/* GET /admin page. */
router.get('/icons', function(req, res, next) {
  res.render('admin/icons');
});
router.get('/convert', function(req, res, next) {
  res.render('admin/converter');
});


module.exports = router;
