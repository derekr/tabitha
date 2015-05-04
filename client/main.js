var Firebase = require('firebase')
var myRootRef = new Firebase('https://intense-inferno-9986.firebaseio.com')
var moment = require('moment')
var values = require('lodash.values')
var sortby = require('lodash.sortby')
var nets = require('nets')

function onValue (target) {
    return function (snapshot) {
        var scores = values(snapshot.val())
        scores = sortby(scores, 'tabs').reverse()
        target.innerHTML = scores.map(function (s) {
            return s.user.username + ': ' + s.tabs
        }).join('<br />')
    }
}

var current = document.getElementById('current')
var currRef = myRootRef.child('current')
var currView = currRef
currView.on('value', onValue(current), function (err) {
    console.error(err)
})

var today = document.getElementById('today')

nets({
    url: '//' + window.location.host + '/api/leaderboard',
    method: 'GET',
    encoding: 'json'
}, function (err, res) {
    if (err) return console.error(err)

    var _ref = JSON.parse(res.body).response.ref
    var ref = myRootRef.child(_ref)
    // var view = ref.limitToLast(1)
    var view = ref

    view.on('value', onValue(today), function (err) {
        console.error(err)
    })
})

var alltime = document.getElementById('alltime')
var alltimeRef = myRootRef.child('alltime')
var alltimeView = alltimeRef
alltimeView.on('value', onValue(alltime), function (err) {
    console.error(err)
})
