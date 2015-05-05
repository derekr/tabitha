require('dotenv').load()

var express = require('express')
var path = require('path')
var favicon = require('serve-favicon')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var passport = require('passport')
var TwitterStrategy = require('passport-twitter')

var Parse = require('./lib/parse')()
var tokenRequest = require('./lib/parse-token-request')
var tokenStorage = require('./lib/parse-token-storage')
var user = require('./lib/parse-user')()
var mapUser = require('./lib/map-user')
var times = require('lodash.times')
var random = require('lodash.random')

var routes = require('./routes/index')
// var users = require('./routes/users')

var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(require('client-sessions')({
  cookieName: 'session',
  secret: process.env.SESSION_SECRET,
  duration: 24 * 60 * 60 * 1000,
  activeDuration: 1000 * 60 * 5
}))
app.use(passport.initialize())
app.use(passport.session())

app.use(express.static(path.join(__dirname, 'public')))

app.use('/', routes)

var callbackUrl = process.env.BASE_URL + '/auth/twitter/callback'

function upsertTwitterUser (accessToken, profile) {
  var query = new Parse.Query(Parse.Object.extend('TokenStorage'))
  query.equalTo('twitterId', profile.id)
  query.ascending('createdAt')

  return query.first({ useMasterKey: true }).then(function (tokenData) {
    if (!tokenData) return newTwitterUser(accessToken, profile)

    var user = tokenData.get('user')
    return user.fetch({ useMasterKey: true }).then(function (user) {
      if (accessToken !== tokenData.get('accessToken')) {
        tokenData.set('accessToken', accessToken)
      }

      return tokenData.save(null, { useMasterKey: true })
    }).then(function (obj) {
      return Parse.Promise.as(user)
    })
  })
}

function newTwitterUser (token, profile) {
  var username = profile.username

  // rando password because we auth against twitter
  var password = new Buffer(24)
  times(24, function (i) {
    password.set(i, random(0, 255))
  })

  return user.signUp({
    username: username,
    password: password.toString(),
    avatar: profile._json.profile_image_url
  }).then(function (user) {
    return tokenStorage({
      user: user,
      twitter: {
        id: profile.id,
        username: profile.username,
        accessToken: token
      }
    })
  }).then(function () {
    upsertTwitterUser(token, profile)
  })
}

passport.use(new TwitterStrategy({
  consumerKey: process.env.TWITTER_KEY,
  consumerSecret: process.env.TWITTER_SECRET,
  callbackURL: callbackUrl, // updated w/ state query param in /auth/twitter
  passReqToCallback: true
},
  function (req, token, tokenSecret, profile, done) {
    var state = req.query.state

    // console.dir(profile)
    //
    // process.nextTick(function () { done() })
    //
    // if (true) return

    if (!(state && token)) {
      return done('Invalid auth response received')
    }

    var query = new Parse.Query(Parse.Object.extend('TokenRequest'))
    Parse.Cloud.useMasterKey()
    Parse.Promise.as().then(function () {
      return query.get(state)
    }).then(function (obj) {
      // destroy token request... start fresh
      return obj.destroy()
    }).then(function () {
      return upsertTwitterUser(token, profile)
    }).then(function (user) {
      done(null, user)
    }, done)
  }
))

passport.serializeUser(function (user, done) {
  done(null, user)
})

passport.deserializeUser(function (obj, done) {
  obj = obj ? mapUser(obj) : obj
  done(null, obj)
})

app.get('/auth/twitter', function (req, res, next) {
  tokenRequest(function (err, obj) {
    if (err) return next(err)

    passport.authenticate('twitter', {
      callbackURL: callbackUrl + '?state=' + obj.id
    })(req, res, next)
  })
})

app.get('/auth/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: '/' }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect('/')
  })

app.get('/logout', function (req, res) {
  req.logout()
  res.redirect('/')
})

app.use('/api', require('./routes/api'))

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500)
    res.render('error', {
      message: err.message,
      error: err
    })
  })
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500)
  res.render('error', {
    message: err.message,
    error: {}
  })
})

module.exports = app
