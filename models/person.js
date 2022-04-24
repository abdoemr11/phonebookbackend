const mongoose = require('mongoose')

//connect
console.log(process.env.MONGODB_URI)
mongoose.connect(process.env.MONGODB_URI)
    .then(result => console.log("connected successfully"))
    .catch(err=> console.log("can't connect to DB", err.message))

//create the schema
const personSchema = mongoose.Schema({
    id: Number,
    name: String,
    number: String,
})
mongoose.set('toJSON',{
    transform: (doc, retObj)=>{
        delete retObj._id
        delete retObj.__v
    }
})
const Person = mongoose.model('Person', personSchema)

module.exports= Person