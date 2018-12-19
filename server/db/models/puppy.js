const Sequelize = require('sequelize')
const db = require('../_db')

const Puppy = db.define('puppy', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  }
})

module.exports = Puppy
