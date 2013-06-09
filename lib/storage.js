var pg = require('pg')


function storage(options) {
  this.pguri = options.postgresURI
  this.pg = pg.connect.bind(pg, this.pguri)
}

storage.prototype.createUser = function(email) {
  this.pg(function(err, client, done) {
    if (err) {
      console.log('Error: ' + err)
      done()
    } else {
      client.query('SELECT * FROM users WHERE email=$1',
                   [email], function(err, result) {
        if (!err && !result.rowCount) {
          client.query('INSERT INTO users(email) VALUES ($1)',
                       [email], function(err, result) {
            done()
          })
        } else {
          done()
        }
      })
    }
  })
}

storage.prototype.createTopic = function(name, description, email) {
  this.pg(function(err, client, done) {
    if (err) {
      console.log('Error: ' + err)
      done()
    } else {
      client.query('INSERT INTO topics(name, description, creator) ' +
                   'SELECT $1, $2, u.id FROM users u WHERE u.email=$3',
                   [name, description, email], function(err, result) {
        if (err) {
          console.log(err)
        }
        done()
      })
    }
  })
}

storage.prototype.getTopicsByUser = function(email, cb) {
  this.pg(function(err, client, done) {
    if (err) {
      console.log('Error: ' + err)
      cb([])
      done()
    } else {
      client.query('SELECT topics.id, name, description FROM topics, users ' +
                   'WHERE topics.creator=users.id AND users.email=$1',
                   [email], function(err, result) {
        if (err) {
          console.log('Error: ' + err)
          cb([])
        } else {
          cb(result.rows)
        }
        done()
      })
    }
  })
}

module.exports = storage