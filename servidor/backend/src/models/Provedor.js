const {model,Schema} = require('mongoose');


const Provedores = new Schema({
    codigo:{
        type:String
    },
    provedor:String,
    direccion:String,
    localidad:{
        type:String,
        default:""
    },
    provincia:{
        type:String,
        default:""
    },
    codPostal:String,
    telefono:{
        type:String,
        default:""
    },
    condIva:String,
    mail:{
        type:String,
        default:""
    },
    cuit:String,
    nro_dgr:{
        type:Number,
        default:0
    },
    dgr:{
        type:String,
        default:""
    },
    saldo:{
        type:Number,
        default:0
    },
    direccionPostal:{
        type:String,
        default:""
    },
    localidadPostal:{
        type:String,
        default:""
    },
    codigoPostal:{
        type:String,
        default:""
    },
    provinciaPosta:{
        type:String,
        default:""
    },
    observaciones:{
        type:String,
        default:""
    }
});

module.exports = model('Provedores',Provedores);