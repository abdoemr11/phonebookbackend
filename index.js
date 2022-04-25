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
app.get('/api/persons/:id', (req, res,next)=>{
    Person.find({id:req.params.id})
        .then(person=>{
            console.log(person)
            if(person.length>0)
                res.json(person)
            else
                res.status(404).end()
        })
        .catch(e=>next(e))
});
app.get('/info', (req, res)=>{
    Person.find({})
        .then(persons=>{
            res.send(`Phonebook has info for ${persons.length} people <br> ${new Date()}` );
        })
});
app.post('/api/persons', (req, res,next)=>{

    const body = req.body;
    let randomId =  Math.floor(Math.random() * 100);
    Person.find({name: body.name})
        .then(p=>{
            console.log(p)
            if(p.length > 0)
            {
                res.status(400).json({"error": "this name is already exist"})
                return
            }
            const person = new Person({
                "id": randomId,
                "name": body.name,
                "number": body.number
            })
            person.save()
                .then(p=>{
                    res.json(p)
                    console.log("saved the new person")
                })
                .catch(e=>next(e))
        })
        .catch(e=> next(e))


})
app.put('/api/persons/:id', (requset, response,next)=>{
    const body = requset.body
    const person = {
        id: requset.params.id,
        name: body.name,
        number: body.number
    }
    Person.findOneAndUpdate({id: requset.params.id},person,
        {new: true, runValidators: true, context: 'query'})
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
    console.error(error.name ," ",error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if(error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}
app.use(errorHandler)
const PORT = process.env.PORT || 3001
app.listen(PORT);