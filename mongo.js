// const mongoose = require('mongoose')
// require('dotenv').config()

// if (process.argv.length<3) {
//   console.log('give password as argument')
//   process.exit(1)
// }

// const password = process.argv[2]

// const name = process.argv[3]

// const number = process.argv[4]

// // const url =
// //   `mongodb+srv://federicosavastano1986:${password}@cluster0.gczjy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

// const url = process.env.MONGODB_URI;
// // console.log("url ", url)

// mongoose.set('strictQuery',false)

// mongoose.connect(url)

// const personSchema = new mongoose.Schema({

//   name: {
//     type: String,
//     minLength: 3,
//     required: true
//   },

//   number: {
//     type: String,
//     minLength: 8,
//     required: true
//   },
// })


// personSchema.set('toJSON', {
//   transform: (document, returnedObject) => {
//     returnedObject.id = returnedObject._id.toString()
//     delete returnedObject._id
//     delete returnedObject.__v
//   }
// })

// const Person = mongoose.model('Person', personSchema)

// const person = new Person({
//     name,
//     number,
// })





// if(!name || !password) {
//     Person.find({}).then(result => {
//         console.log("Phonebook:")
//         result.forEach(person => {
//           console.log(person)
//         })
//         mongoose.connection.close()
//       })



// } else {
//     person.save().then(result => {
//         console.log( `added ${name} number ${number} to phonebook` )
//         mongoose.connection.close()
//       })



// }



