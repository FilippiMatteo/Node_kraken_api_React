let mongoose = require ('mongoose');

const server= 'localhost:27017';
const database= 'DbKraken';
const user= 'admin123';
const password ='admin123';

 mongoose.connect(`mongodb://${user}:${password}@${server}/${database}`);
let UsersSchema = new mongoose.Schema ({
    name : String,
    email:{
        type :String,
        require :true,
        unique :true
    },
    key: String,
    secret : String
});






module.exports = mongoose.model ('Users',UsersSchema);