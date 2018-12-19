const db = require('../_db')
const Puppy = require('./puppy')

Puppy.hasMany(Toy)
Toy.belongsTo(Puppy)

module.exports = {
  db,
  Puppy,
  Toy
}
