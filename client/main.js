var React = require('react')
var Firebase = require('firebase')
var moment = require('moment')
var values = require('lodash.values')
var sortby = require('lodash.sortby')
var random = require('lodash.random')
var nets = require('nets')

var OrderedList = require('./components/ordered-list.jsx')
var InlineOrderedList = require('./components/inline-ordered-list.jsx')
var SitesList = require('./components/sites-list.jsx')

var $othertop = document.getElementById('othertop')
var $top = document.getElementById('top')
var $sites = document.getElementById('sites')

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

var sites = myRootRef.child('sites')
var limitSites = sites.limitToLast(20)

var blacklist = [
  'www.pornhub.com',
  'localhost',
  'comedyhackday.slack.com'
]

limitSites.on('value', function (snap) {
  var scores = sortby(values(snap.val()), 'count').reverse()
  scores = scores.filter(function (s) {
    return (blacklist.indexOf(s.url) === -1)
  })

  scores = scores.map(function (s) {
    return {
      text: s.url,
      count: s.count
    }
  })

  React.render(<SitesList offset={ 1 } scores={ scores } />, $sites)
})
