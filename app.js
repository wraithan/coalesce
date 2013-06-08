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
, secret: process.env.SECRET || '1234567890QWERTY'
}))
app.use(app.router)
app.use(express.static(path.join(__dirname, 'static')))
app.engine('jade', require('jade').__express)
app.set('views', path.join(__dirname, 'templates'))

app.get('/', function (req, res) {
  var email
  if (req.session !== undefined) {
    email = req.session.email
  }
  res.render('index.jade', {
    user: email
  })
})

app.get('/topic/create', function(req, res) {
  res.render('create.jade')
})

app.post('/topic/create', function(req, res) {
  console.log(req.body)
  storage.createTopic(req.body.name, req.body.description, req.session.email)
  res.redirect('/topic/list')
})

app.get('/topic/list', function(req, res) {
  storage.getTopics(req.session.email, function(topics) {
    res.render('list.jade', {topics: topics})
  })
})

function verifyResponse(error, req, res, email) {
  if (error) {
    res.json({
      status: 'failure'
    , reason: error
    })
  } else {
    storage.createUser(email)
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
