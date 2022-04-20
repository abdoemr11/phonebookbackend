const express = require('express');
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
app.get('/api/persons', (req, res)=>{
    console.log('hit this url')
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
app.delete('/api/persons/:id', (req, res)=>{
    const id = Number(req.params.id);
    persons = persons.filter(p=>p.id !== id);
    res.status(204).end();
})
const PORT = 3001
app.listen(PORT);