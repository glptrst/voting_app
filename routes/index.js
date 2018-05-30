var express = require('express');
var router = express.Router();

// GET /
router.get('/', function(req, res, next) {
  return res.render('index', { title: 'Voting App' });
});

module.exports = router;
