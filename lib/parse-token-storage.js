var Parse = require('./parse')()
var acl = require('./parse-restricted-acl')()

module.exports = function (opts) {
    var tokenStorage = new Parse.Object('TokenStorage');

    tokenStorage.setACL(acl);

    tokenStorage.set('twitterId', opts.twitter.id)
    tokenStorage.set('twitterLogin', opts.twitter.username)
    tokenStorage.set('accessToken', opts.twitter.accessToken)
    tokenStorage.set('user', opts.user)

    return tokenStorage.save(null, { useMasterKey: true });
}
