var Parse = require('./parse')()

module.exports = function () {
    var restrictedAcl = new Parse.ACL();
    restrictedAcl.setPublicReadAccess(false);
    restrictedAcl.setPublicWriteAccess(false);
    return restrictedAcl
}
