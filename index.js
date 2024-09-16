const express = require('express');
const morgan = require('morgan')
const cors = require('cors')


const app = express();

app.use(express.json());
 
app.use(express.static('dist'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body :host'))
app.use(cors())


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
];


//Custom tokens
morgan.token('host', function(req, res) {
    return req.hostname;
});

morgan.token('body', req => {
  return JSON.stringify(req.body)
})

const generateId = () => {
    const idNumber = Math.round(Math.random() * 5000);
    return String(idNumber);
};

app.get('/api/persons', (request, response) => {
    response.json(persons);
    
});

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    const person = persons.find((person) => person.id === id);
    if (person) {
        response.json(person);
    } else {
        response.status(404).end();
    }
});

app.get('/info', (request, response) => {
    let info = `
    <p>Phonebook has info for ${persons.length} persons</p>
    <br/>
    <p>${new Date()}</p>
    `;
    response.send(info);
});

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    persons = persons.filter((person) => person.id !== id);

    response.status(204).end();
});

app.post('/api/persons/', (request, response) => {
    const body = request.body;

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number missing',
        });
    }

    if (persons.map((p) => p.name).includes(body.name)) {
        return response.status(400).json({
            error: 'name must be unique',
        });
    }

    const newPerson = {
        name: body.name,
        number: body.number,
        id: generateId(),
    };
    
     
    persons = persons.concat(newPerson);
   
    response.json(newPerson);

  
  

});

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
