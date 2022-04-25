const mongoose = require('mongoose')

//connect
console.log(process.env.MONGODB_URI)
mongoose.connect(process.env.MONGODB_URI)
    .then(result => console.log("connected successfully"))
    .catch(err=> console.log("can't connect to DB", err.message))

//create the schema
const personSchema = mongoose.Schema({
    id: {
        type:Number,
        required: true
    },
    name:{
        type:String,
        minLength: 3,
        required: true
    },
    number: {
        type:String,
        validate: {
            validator: function(v) {
                console.log(typeof v)
                if (v.length < 8)
                    return false;
                return /\d{2,3}-\d{3}/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        },
        required: true
    },
})
mongoose.set('toJSON',{
    transform: (doc, retObj)=>{
        delete retObj._id
        delete retObj.__v
    }
})
const Person = mongoose.model('Person', personSchema)

module.exports= Person