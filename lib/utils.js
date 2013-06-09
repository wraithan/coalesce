var utils = {}

utils.emailFromRequest = function(req) {
  if (req.session !== undefined) {
    return req.session.email
  }
  return undefined
}

module.exports = utils