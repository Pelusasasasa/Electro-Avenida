const {model,Schema} = require('mongoose')


const cliente = new Schema({
    _id:{
        type: String,
        required: true
    },
    cliente:{
        type:String,
        required:true
    },
    direccion:{
        type:String,
        default:""
    },
    cod_postal:{
        type: String,
        required:false
    },
    localidad:{
        type:String,
        required:false
    },
    provincia:{
        type:String,
        required:false
    },
    telefono:{
        type:String,
        required:false
    },
    cond_iva:{
        type:String,
        required:false
    },
    cuit:{
        type:String,
        required:false
    },
    observacion:{
        type: String,
        default: ""
    },
    condicion:{
        type: String,
        default: "N"
    },
    mail:String,
    saldo: {
        type:Number,
        default: 0
    },
    lim_compra: Number,
    cond_fact: String,
    saldo_p: {
        type: Number,
        default: 0
    }
})

module.exports = model('Cliente',cliente)