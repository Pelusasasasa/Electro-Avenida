const {model,Schema} = require('mongoose');

const CuentaComp = new Schema({
    _id:{
        type:Number,
        required:true
    },
    codigo:{
        type: String,
        required: true
    },
    fecha:{
        type: Date,
        default: Date.now
    },
    cliente:{
        type: String,
        required: true
    },
    tipo_comp:{
        type: String,
        required: true,
    },
    nro_comp:{
        type:String,
        required: true
    },
    importe:{
        type: Number,
        required:true
    },
    pagado:{
        type: Number,
        default:0
    },
    saldo:{
        type:Number,
        required: true
    },
    observaciones:{
        type:String,
        default:"",
        set: (valor) => valor.toUpperCase()
    }
});

module.exports = model('CuentaComp',CuentaComp);