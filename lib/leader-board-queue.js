var atomic = require('atomic-queue')
var Firebase = require('firebase')
var myRootRef = new Firebase('https://intense-inferno-9986.firebaseio.com')
var async = require('async')
var md5 = require('MD5')

var moment = require('moment')

function updateBoard (current) {
    if (!current) {
        var data = {
            user: {
                username: this.username,
                avatar: this.avatar
            },
            tabs: 1,
            '.priority': 1
        }

        return data
    }

    current.tabs += this.value // pass in -1 or 1

    // cap at 0
    if (current.tabs < 0) return

    current['.priority'] = current.tabs
    return current
}

function updateUrl (current) {
  if (!current) {
      var data = {
          url: this.url,
          count: 1,
          '.priority': 1
      }

      return data
  }

  current.count += 1

  // cap at 0
  if (current.count < 0) return

  current['.priority'] = current.count
  return current
}

module.exports = function () {
    return atomic(function (data, done) {
        async.auto({
            auth: function (callback) {
                myRootRef.authWithCustomToken(
                    process.env.FIREBASE_SECRET,
                    callback
                )
            },

            todayBoard: ['auth', function (callback) {
                if (data.value < 0) return callback(null)
                if (data.url) return callback(null)

                var date = moment().startOf('day').format('X')
                var ref = myRootRef.child(date + '/' + data.username)
                ref.transaction(updateBoard.bind(data), callback)
            }],

            alltime: ['auth', function (callback) {
                if (data.value < 0) return callback(null)
                if (data.url) return callback(null)

                var ref = myRootRef.child('/alltime/' + data.username)
                ref.transaction(updateBoard.bind(data), callback)
            }],

            current: ['auth', function (callback) {
                if (data.url) return callback(null)
                var ref = myRootRef.child('/current/' + data.username)
                ref.transaction(updateBoard.bind(data), callback)
            }],

            url: ['auth', function (callback) {
              if (!data.url) return callback(null)

              var ref = myRootRef.child('/sites/' + md5(data.url))
              ref.transaction(updateUrl.bind(data), callback)
            }]
        }, done)
    })
}
