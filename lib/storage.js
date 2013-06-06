var pg = require('pg')


function storage(options) {
  this.pguri = options.postgresURI
  this.pg = pg.connect.bind(pg, this.pguri)
}

storage.prototype.createUser = function(email) {
  this.pg(function(err, client, done) {
    client.query('SELECT * FROM users WHERE email=$1',
                 [email], function(err, result) {
      if (!err) {
        if (!result.rowCount) {
          client.query('INSERT INTO users(email) VALUES ($1)', [email])
        }
      }
     })
  })
}

module.exports = storage