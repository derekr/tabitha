var Firebase = require('firebase')
var myRootRef = new Firebase('https://intense-inferno-9986.firebaseio.com')
var moment = require('moment')
var values = require('lodash.values')
var sortby = require('lodash.sortby')

var date = moment().startOf('day').format('X')
var ref = myRootRef.child(date)
// var view = ref.limitToLast(1)
var view = ref

var test = document.getElementById('test')

view.on('value', function (snapshot) {
    var scores = values(snapshot.val())
    scores = sortby(scores, 'tabs').reverse()
    test.innerHTML = scores.map(function (s) {
        return s.user.username + ': ' + s.tabs
    }).join('<br />')
}, function (err) {
    console.error(err)
})
