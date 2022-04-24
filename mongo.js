const mongoose = require('mongoose');

if(process.argv.length < 3) {
    console.log('You should supply your password');
    process.exit();
}
let name, number;
let query = true;
if(process.argv.length === 5) {
    name = process.argv[3];
    number = process.argv[4]
    query = false;
} else if (process.argv.length !== 3) {
    console.log(`you should either supply the new name and password that you want to add
                or leave it blank to get all the persons`);
    process.exit();
}
console.log(name, number)
const PASS = process.argv[2];
const url = `mongodb+srv://abdoemr11:${PASS}@cluster0.aankg.mongodb.net/phonebookApp?retryWrites=true&w=majority`
mongoose.connect(url).catch((e)=>console.log(e))
const personSchema = mongoose.Schema({
    id: Number,
    name: String,
    number: String,
})
const Person = mongoose.model('Person', personSchema)
if(query){
    Person.find({}).then(result=>{
        console.log("phonebook:")

        result.forEach(person=>{
            console.log(person.name, person.number)
            mongoose.connection.close()
        })
    })
} else {
    const person = new Person({
        id: Math.floor(Math.random(100)),
        name: String(name),
        number: String(number),
    })
    person.save().then(res=>{
        console.log(`added ${name} number ${number} to phonebook`)
        mongoose.connection.close()
    })
}