var Parse = require('./parse')()
var Tab = Parse.Object.extend('Tab')

module.exports = function (opts) {
    return new Tab()
}
