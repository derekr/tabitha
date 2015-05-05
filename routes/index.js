var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('leaderboard', { title: 'Leader Board', user: req.user });
});

router.get('/leaderboard', function(req, res, next) {
  res.render('leaderboard', { title: 'Leader Board', user: req.user });
});


module.exports = router;
