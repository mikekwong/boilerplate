const db = require('../_db')
const User = require('./user')
const Toy = require('./toy')

User.hasMany(Toy)
Toy.belongsTo(User)

module.exports = {
  db,
  User,
  Toy
}
