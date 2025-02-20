const {Schema,model} = require('mongoose');

const Prestamo = new Schema({
    fecha:{
        type:Date,
        default:Date.now
    },
    codigo:{
        type:String,
        default:"9001"
    },
    cliente:{
        type:String,
        default: "A Consumidor Final"
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
    telefono:{
        type:String,
        default:""
    },
    condIva:{
        type:String,
        default:""
    },
    precioFinal:{
        type:Number,
        default:0
    },
    tipo_comp:{
        type:String,
        default:true
    },
    tipo_pago:{
        type:String,
        default:"PR"
    },
    nro_comp:{
        type:String,
        required:true
    },
    vendedor:{
        type:String,
        default:""
    },
    observaciones:{
        type:String,
        default:""
    },
    anulado:{
        type:Boolean,
        default:false
    },
    nroPresupuesto:{
        type:String,
        default:""
    }
});

module.exports = model('Prestamo',Prestamo);