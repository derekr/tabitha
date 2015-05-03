require('dotenv').load()

var moment = require('moment')

var Parse = require('./lib/parse')()

var query = new Parse.Query('Tab')
var user = new Parse.User()
user.id = 'WlFNF8Inop'

query.equalTo('parent', user)
var date = moment().startOf('day')
// var date = moment().subtract(10, 'minutes')
console.dir(date.fromNow())
console.dir(date.toDate())
query.greaterThanOrEqualTo('createdAt', date.toDate())

query.count().then(function (count) {
    console.log('today', count)
}, function (err) {
    console.error(err)
})
