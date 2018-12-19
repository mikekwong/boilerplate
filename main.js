// say our sequelize instance is create in 'db.js'
const db = require('./server/db/_db')
// and our server that we already created and used as the previous entry point is 'server.js'
const app = require('./server')
const PORT = process.env.PORT || 3000

const init = async () => {
  await db.sync() // if you update your db schemas, make sure you drop the tables first and then recreate them // sync our db
  console.log('db synced')
  app.listen(PORT, () => console.log(`server flyin on port ${PORT}`))
}

init()
