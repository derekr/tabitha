var Parse = require('./parse')()
var acl = require('./parse-restricted-acl')()

module.exports = function (callback) {
    var tokenRequest = new Parse.Object('TokenRequest');
    tokenRequest.setACL(acl);
    tokenRequest
        .save(null, { useMasterKey: true })
        .then(
            function tokenRequestSuccess (obj) {
                callback(null, obj)
            },
            function tokenRequestError (err) {
                callback(err)
            }
        )
}
