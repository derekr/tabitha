var atomic = require('atomic-queue')
var Firebase = require('firebase')
var myRootRef = new Firebase('https://intense-inferno-9986.firebaseio.com')

var moment = require('moment')

function updateBoard (current) {
    if (!current) {
        var data = {
            user: {
                username: this.username,
                avatar: this.avatar
            },
            tabs: 1,
            '.priority': 0
        }

        return data
    }

    current.tabs += 1
    current['.priority'] = current.tabs
    return current
}

module.exports = function () {
    return atomic(function (data, done) {
        var date = moment().startOf('day').format('X')
        var ref = myRootRef.child(date + '/' + data.username)

        myRootRef.authWithCustomToken(
            process.env.FIREBASE_SECRET,
            function (err, authData) {
            ref.transaction(updateBoard.bind(data), done)
        })
    })
}
