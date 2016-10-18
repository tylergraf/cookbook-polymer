var express = require('express');
var router = express.Router();

/* GET /admin page. */
router.get('/icons', function(req, res, next) {
  res.render('admin/icons');
});


module.exports = router;
