var Parse = require('parse').Parse;

Parse.initialize(
    process.env.PARSE_APP_ID,
    process.env.PARSE_JS_KEY,
    process.env.PARSE_MASTER_KEY
);

module.exports = function () {
    return Parse
}
