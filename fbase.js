var Firebase = require('firebase')
var myRootRef = new Firebase('https://intense-inferno-9986.firebaseio.com')

var today = myRootRef.child('today')
var tomorrow = myRootRef.child('tomorrow')

var random = require('lodash.random')

var names = ['drk', 'drkafterdark', 'tanner', 'joe', 'crystal', 'grape', 'test']

function rName () {
    return names[random(0, names.length - 1)]
}

myRootRef.authWithCustomToken('y2J4WkgUxYWlBh64AH07cSQgo694I9LvYBQAY21K', function (err, authData) {
    if (err) {
        return console.error(err)
    }

    console.dir(authData)

    setInterval(function () {
        var name = rName()
        var score = random(0, 50)
        var user = today.child(name)
        user.transaction(function (current) {
            if (!current) {
                var t = {
                  username: name,
                  score: score,
                  '.priority': score
                }
                return t
            }

            current.score = score
            current['.priority'] = score
            return current
        })
    }, 1500)

    // setInterval(function () {
    //     tomorrow.transaction(function (current) {
    //         if (!current) {
    //             var t = {}
    //             t[rName()] = random(0, 50)
    //             return t
    //         }
    //
    //         current[rName()] = random(0, 50)
    //         return current
    //     })
    // }, 1500)
})

// setInterval(function () {
    // var name = names[random(0, names.length - 1)]
//     var score = names
// }, 2000)
