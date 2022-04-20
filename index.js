const express = require('express');
const morgan = require('morgan');
let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
];
app = express();
app.use(express.json());
app.use(morgan('tiny'));
app.get('/api/persons', (req, res)=>{
    res.json(persons);
});
app.get('/api/persons/:id', (req, res)=>{
    const id = Number(req.params.id);
    const person = persons.find(p=>p.id ===id);
    if(person)
        res.json(person);
    else
        res.status(404).end();
});
app.get('/info', (req, res)=>{
    res.send(`Phonebook has info for ${persons.length} people <br> ${new Date()}` );
});
app.post('/api/persons', (req, res)=>{

    const body = req.body;
    if(!(body.name && body.number))
        res.status(400).json({
            "error": "You havn't provide a name or a number "
        })
    if(persons.some(p=>p.name ===body.name))
        res.status(400).json({
            "error": `${body.name} is already exist`
        })

    let randomId =  Math.floor(Math.random() * 100);
    const person = {
        "id": randomId,
        "name": body.name,
        "number": body.number
    }
    persons = persons.concat(person);
    res.json(person);

})
app.delete('/api/persons/:id', (req, res)=>{
    const id = Number(req.params.id);
    persons = persons.filter(p=>p.id !== id);
    res.status(204).end();
})
const PORT = 3001
app.listen(PORT);