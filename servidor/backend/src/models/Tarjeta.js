const {Schema,model} = require('mongoose');

const Tarjeta = new Schema({
    fecha:{
        type:Date,
        default: Date.now
    },
    tarjeta:{
        type:String,
        default:""
    },
    imp:{
        type:Number,
        default:0.0
    },
    vendedor:String
});

module.exports = model('Tarjeta',Tarjeta);