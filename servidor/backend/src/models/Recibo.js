const {Schema,model} = require('mongoose');

const Recibo = new Schema({
    fecha:{
        type:Date,
        default: Date.now
    },
    codigo:{
        type:Number,
        default:9001
    },
    cliente:{
        type:String,
        default: "A Consumidor Final"
    },
    precioFinal:{
        type:Number,
        required:true
    },
    tipo_comp:{
        type:String,
        required:true
    },
    vendedor:{
        type:String,
        required:true
    }
})

module.exports = model('Recibo',Recibo)