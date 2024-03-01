const {Schema,model} = require('mongoose');

const Tarjeta = new Schema({
    fecha:{
        type:Date,
        default: Date.now
    },
    cliente:{
        type:String,
        default:"A Consumidor Final"
    },
    tipo_comp:{
        type:String,
        require:true,
        set:(value) => value.toUpperCase()
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