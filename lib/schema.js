var pg = require('pg')
  , uri = 'tcp://cmcdonald@localhost/coalesce'

var client = new pg.Client(uri)
client.connect()

if (module.id === '.') {
  create_users = [
    'CREATE TABLE users('
  , 'id serial PRIMARY KEY,'
  , 'email text UNIQUE'
  , ')'
  ].join('')
  create_topics = [
    'CREATE TABLE topics('
    , 'id serial PRIMARY KEY,'
    , 'creator integer REFERENCES users(id),'
    , 'name text,'
    , 'description text'
    , ')'
  ].join('')
  client.query(create_users, function(err, data) {
    if (err) {
      console.log('Failed creating users: ')
      console.log(err)
    } else {
      console.log('Created users table.')
      client.query(create_topics, function(err, data) {
        if (err) {
          console.log('Failed creating topics: ')
          console.log(err)
        } else {
          console.log('Created topics table.')
        }
      })
    }
  })

  client.on('drain', function() {
    console.log('Done creating tables.')
    client.end()
  })
}