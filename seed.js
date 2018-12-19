const { db } = require('./server/db/models')
const { green, red } = require('chalk')
const User = require('./server/db/models/user')
// const Country = require('./server/db/models/country')

const seed = async () => {
  await db.sync({ force: true })

  // await Country.bulkCreate([
  //   {
  //     name: 'U.S.A',
  //     GFI: 0,
  //     flagURL:
  //       'https://upload.wikimedia.org/wikipedia/en/thumb/a/a4/Flag_of_the_United_States.svg/1280px-Flag_of_the_United_States.svg.png'
  //   }
  // ])

  await User.bulkCreate([
    {
      make: 'Curtiss Falcon',
      model: 'A-3',
      year: 1954,
      type: 'Attack',
      cost: 1.0,
      imageURL:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Curtiss_A-3_Falcon_%28SN_27-243%29.jpg/800px-Curtiss_A-3_Falcon_%28SN_27-243%29.jpg',
      description:
        'The Curtiss Falcon was a family of military biplane aircraft built by the American aircraft manufacturer Curtiss Aeroplane and Motor Company during the 1920s. Most saw service as part of the United States Army Air Corps as observation aircraft with the designations O-1 and O-11, or as the attack aircraft designated the A-3 Falcon.',
      countryId: 1
    }
  ])

  console.log(green('Seeding success!'))
  db.close()
}

seed().catch(err => {
  console.error(red('Oh noes! Something went wrong!'))
  console.error(err)
  db.close()
})
