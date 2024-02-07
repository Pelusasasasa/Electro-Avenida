const {model,Schema} = require('mongoose');

const CuentaHisto = new Schema({
    _id:{
        type: Number,
        required:true
    },
    codigo:{
        type:String,
        required:true
    },
    fecha:{
        type:Date,
        default:Date.now
    },
    cliente:{
        type:String,
        required:true
    },
    tipo_comp:{
        type:String,
        required:true
    },
    nro_comp:{
        type:String,
        required:true
    },
    debe:{
        type:Number,
        default:0
    },
    haber:{
        type:Number,
        default:0
    },
    saldo:{
        type:Number,
        required:true
    },
    observaciones:{
        type:String,
        default:"",
        set: (valor) => valor.toUpperCase()
    }
})

module.exports = model("CuentaHisto",CuentaHisto)