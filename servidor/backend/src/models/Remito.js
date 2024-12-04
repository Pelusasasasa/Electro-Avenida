const {Schema,model} = require('mongoose');

const Remito = new Schema({
    fecha:{
        type:Date,
        default:Date.now
    },
    vendedor:{
        type:String,
        required:true
    },
    nro_comp:{
        type:String,
        required:true
    },
    tipo_pago:{
        type:String,
        default:"RT"
    },
    tipo_comp:{
        type:String,
        default:"Remito"
    },
    cliente:{
        type:String,
        default:"A Consumidor Final"
    },
    idCliente:{
        type:String,
        default:'9001'
    },
    observaciones:{
        type:String,
        default:""
    }
});

module.exports = model('Remito',Remito);