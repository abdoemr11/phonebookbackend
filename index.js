require('dotenv').config()
const express = require('express');
const morgan = require('morgan');
const Person = require('./models/person')
const {response} = require("express");

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
app.use(express.static('build'))
app.use(express.json());
morgan.token('json', (req, res)=>{
    console.log(req.body)
    return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :json'));

app.get('/api/persons', (req, res)=>{
    Person.find({})
        .then((persons)=>{
            res.json(persons)
        })
        .catch((err)=>res.status(404).end())
});
app.get('/api/persons/:id', (req, res)=>{
    const person = Person.find({id:req.params.id})
        .then(person=>res.json(person))

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
    const person = new Person({
        "id": randomId,
        "name": body.name,
        "number": body.number
    })
    person.save()
        .then(p=>res.json(p))

})
app.put('/api/persons/:id', (requset, response,next)=>{
    const body = requset.body
    const person = {
        id: requset.params.id,
        name: body.name,
        number: body.number
    }
    Person.findOneAndUpdate({id: requset.params.id},person,{new: true})
        .then(newP=>response.json(newP))
        .catch(e=>next(e))
})
app.delete('/api/persons/:id', (req, res,next)=>{
    Person.findOneAndDelete({id: req.params.id})
        .then(person=>{
            res.status(204).end();
        })
        .catch(e=>next(e))

})
const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }

    next(error)
}
app.use(errorHandler)
const PORT = process.env.PORT || 3001
app.listen(PORT);