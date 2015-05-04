var express = require('express');
var router = express.Router();
var cors = require('cors')
var leaderBoard = require('../lib/leader-board-queue')()
var Parse = require('../lib/parse')()
var Tab = require('../lib/parse-tab')

// all prefixed w/ /api
router.options('/tab', cors())
router.post('/tab', cors(), function (req, res) {
  if (!req.user) {
    res.status(401)
    res.json({
      head: {
        code: 401
      },
      response: {
        error: 'Unauthorized'
      }
    })

    return
  }

  var user = new Parse.User()
  user.id = req.user.id
  Tab().save({
    parent: user
  }).then(function () {
    leaderBoard.write({
      username: req.user.username,
      avatar: req.user.avatars.lrg,
      value: 1
    })

    res.json({
      head: {
        status: 200
      },
      response: {
        yours: req.body,
        user: req.user
      }
    })
  })
})

router.delete('/tab', function (req, res) {
    if (!req.user) {
      res.status(401)
      res.json({
        head: {
          code: 401
        },
        response: {
          error: 'Unauthorized'
        }
      })

      return
    }

    var user = new Parse.User()
    user.id = req.user.id
    // Tab().save({
    //   parent: user
    // }).then(function () {
    //
    // })
    leaderBoard.write({
      username: req.user.username,
      avatar: req.user.avatars.lrg,
      value: -1
    })

    res.json({
      head: {
        status: 200
      },
      response: {
        yours: req.body,
        user: req.user
      }
    })
})

var moment = require('moment')
router.options('/leaderboard', cors())
router.get('/leaderboard', cors(), function (req, res) {
  res.json({
    response: {
      ref: moment().startOf('day').format('X')
    }
  })
})

module.exports = router
