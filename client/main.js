var React = require('react')
var Firebase = require('firebase')
var moment = require('moment')
var values = require('lodash.values')
var sortby = require('lodash.sortby')
var random = require('lodash.random')
var nets = require('nets')

var OrderedList = require('./components/ordered-list.jsx')
var InlineOrderedList = require('./components/inline-ordered-list.jsx')

var $othertop = document.getElementById('othertop')
var $top = document.getElementById('top')

var myRootRef = new Firebase('https://intense-inferno-9986.firebaseio.com')

var current = myRootRef.child('current')
var limitView = current.limitToFirst(23)

limitView.on('value', function (snap) {
  var scores = sortby(values(snap.val()), 'tabs').reverse()
  var top = scores.slice(0,3)
  var others = scores.slice(3)

  React.render(<InlineOrderedList offset={ 1 } scores={ top } />, $top)
  React.render(<OrderedList offset={ 4 } scores={ others } />, $othertop)
})
