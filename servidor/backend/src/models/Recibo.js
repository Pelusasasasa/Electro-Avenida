const {Schema,model} = require('mongoose');

const Recibo = new Schema({
    fecha:{
        type:Date,
        default: Date.now
    },
    codigo:{
        type:String,
        default:"9001"
    },
    cliente:{
        type:String,
        default: "A Consumidor Final"
    },
    tipo_comp:{
        type:String,
        required:true
    },
    direccion:{
        type:String,
        default:""
    },
    localidad:{
        type:String,
        default:""
    },
    dnicuit:{
        type:String,
        default:""
    },
    condIva:{
        type:String,
        default:""
    },
    precioFinal:{
        type:Number,
        required:true
    },
    nro_comp:{
        type:String,
        required:true
    },
    vendedor:{
        type:String,
        required:true
    },
    saldoAFavor:{
        type:Number,
        default:0
    },
    observaciones:{
        type:String,
        default:""
    },
    comprobantes:{
        type:Array,
        default:[]
    }
})

module.exports = model('Recibo',Recibo)