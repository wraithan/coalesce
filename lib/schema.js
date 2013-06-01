var pg = require('pg')
  , uri = 'tcp://cmcdonald@localhost/coalesce'

var client = new pg.Client(uri)
client.connect()

if (module.id === '.') {
  client.query('CREATE TABLE users(id serial, email text)', function(){
    console.log('Created users table.')
  })
  client.on('drain', function() {
    console.log('Done creating tables.')
    client.end()
  })
}