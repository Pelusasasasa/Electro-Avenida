const {model,Schema} = require('mongoose');

const Cuenta = new Schema({
    cod:{
        type:String
    },
    desc:{
        type:String
    },
    tipo:String
});

module.exports = model('Cuenta',Cuenta);