var express = require('express')
  , http = require('http')
  , path = require('path')
  , persona = require('express-persona')
  , libStorage = require('./lib/storage')
  , RedisStore = require('connect-redis')(express)

var app = express()
var storage = new libStorage({
  postgresURI: 'tcp://cmcdonald@localhost/coalesce'
})

// all environments
app.set('port', process.env.PORT || 3000)
app.use(express.favicon())
app.use(express.logger('dev'))
app.use(express.bodyParser())
app.use(express.cookieParser())
app.use(express.session({
  store: new RedisStore({
    host: 'localhost'
  , port: 6379
  , db: 0
  })
, secret: '1234567890QWERTY'
}))
app.use(app.router)
app.use(express.static(path.join(__dirname, 'static')))
app.engine('jade', require('jade').__express)
app.set('views', path.join(__dirname, 'templates'))

app.get('/', function (req, res) {
  console.log(req.session.email)
  res.render('index.jade', {user: req.session.email})
})

function verifyResponse(error, req, res, email) {
  if (error) {
    res.json({
      status: 'failure'
    , reason: error
    })
  } else {
    storage.getOrCreateUser(email)
    res.json({
      status: 'okay'
    , email: email
    })
  }
}

persona(app, {
  audience: 'http://localhost:3000'
, verifyResponse: verifyResponse
})

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'))
})