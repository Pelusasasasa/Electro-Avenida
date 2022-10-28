const {model,Schema} = require('mongoose');

const Factura = new Schema({

    fecha:{
        type:Date,
        default:Date.now
    },
    nro_comp:String,
    rSoc:String,
    concepto:{
        type:String,
        default:""
    },
    imp:{
        type:Number,
        default:0
    },
    tipo:String,
    pago:{
        type:String,
        default:""
    }


});

module.exports = model('Factura',Factura)