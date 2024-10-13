const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()

const app = express()

app.use(express.json())
app.use(express.static('dist'))

app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :body :host'
  )
)
app.use(cors())

const Person = require('./models/person')

//Data
let persons = [
  {
    'id': '1',
    'name': 'Arto Hellas',
    'number': '040-123456',
  },
  {
    'id': '2',
    'name': 'Ada Lovelace',
    'number': '39-44-5323523',
  },
  {
    'id': '3',
    'name': 'Dan Abramov',
    'number': '12-43-234345',
  },
  {
    'id': '4',
    'name': 'Mary Poppendieck',
    'number': '39-23-6423122',
  },
]

//Custom tokens
morgan.token('host', function (req) {
  return req.hostname
})

morgan.token('body', (req) => {
  return JSON.stringify(req.body)
})

// const generateId = () => {
//     const idNumber = Math.round(Math.random() * 5000);
//     return String(idNumber);
// };

// app.get('/api/persons', (request, response) => {
//     response.json(persons);

// });

app.get('/api/persons', (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons)
  })
})

// app.get('/api/persons/:id', (request, response) => {
//     const id = request.params.id;
//     const person = persons.find((person) => person.id === id);
//     if (person) {
//         response.json(person);
//     } else {
//         response.status(404).end();
//     }
// });

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
  // .catch(error => {
  //     console.log(error)
  //     response.status(400).send({ error: 'malformatted id' })
  //   })
    .catch((error) => next(error))
})

app.get('/info', (request, response) => {
  let info = `
    <p>Phonebook has info for ${persons.length} persons</p>
    <br/>
    <p>${new Date()}</p>
    `
  response.send(info)
})

// app.delete('/api/persons/:id', (request, response) => {
//     const id = request.params.id;
//     persons = persons.filter((person) => person.id !== id);

//     response.status(204).end();
// });

// app.delete('/api/persons/:id', (request, response) => {
//     const id = request.params.id;
//     Person.deleteOne({
//         _id: id
//     }).then(deletedPerson => {
//         response.json(deletedPerson)
//       })
// })

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch((error) => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  const person = {
    name,
    number,
  }

  Person.findByIdAndUpdate(request.params.id, person, {
    new: true,
    runValidators: true,
    context: 'query',
  })
    .then((updatedNote) => {
      response.json(updatedNote)
    })
    .catch((error) => next(error))
})

// app.post('/api/persons/', (request, response) => {
//     const body = request.body;

//     if (!body.name || !body.number) {
//         return response.status(400).json({
//             error: 'name or number missing',
//         });
//     }

//     if (persons.map((p) => p.name).includes(body.name)) {
//         return response.status(400).json({
//             error: 'name must be unique',
//         });
//     }

//     const newPerson = {
//         name: body.name,
//         number: body.number,
//         id: generateId(),
//     };

//     persons = persons.concat(newPerson);

//     response.json(newPerson);

// });

app.post('/api/persons/', (request, response, next) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number missing',
    })
  }

  if (persons.map((p) => p.name).includes(body.name)) {
    return response.status(400).json({
      error: 'name must be unique',
    })
  }

  const newPerson = new Person({
    name: body.name,
    number: body.number,
  })

  newPerson
    .save()
    .then((savedPerson) => {
      response.json(savedPerson)
    })
    .catch((error) => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)

const PORT = process.env.PORT || 3002
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
