let mongoose = require ('mongoose');
/*
const server= 'localhost:27017';
const database= 'DbTestName';
const user= 'app1';
const password ='app123';

 mongoose.connect(`mongodb://${user}:${password}@${server}/${database}`);
let CustomerSchema = new mongoose.Schema ({
    name : String,
    email:{
        type :String,
        require :true,
        unique :true
    }
});
*/


const server= 'mongodb.cloudno.de:27017';
const database= 'customer';
const user= 'filippi.matteo.g';
const password ='XdQ0WeR7s0';
console.log(`mongodb://${user}:${password}@${server}/${database}`);

mongoose.connect(`mongodb://${user}:${password}@${server}/${database}`);
let PersonSchema = new mongoose.Schema ({
  name : String,
  email:{
    type :String,
    require :true,
    unique :true
  }
});



module.exports = mongoose.model ('Person',PersonSchema);