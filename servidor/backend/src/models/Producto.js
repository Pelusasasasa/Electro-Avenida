const {model,Schema} = require('mongoose')

const Producto = new Schema({
    _id:{
        type:String,
        required: true
    },
    cod_fabrica: {
        type: String,
        default: ""
    },
    descripcion: {
        type: String,
        required: true
    },
    provedor: {
        type: String,
        default: ""
    },
    marca: {
        type: String,
        default: ""
    },
    stock: {
        type: String,
        default: "0"
    },
    iva: {
        type: String,
        dafault: "N"
    },
    costo: {
        type: String,
        default: "0"
    },
    costodolar: {
        type: Number,
        default: 0
    },
    impuestos: {
        type: String,
        default: "0"
    },
    observacion: {
        type: String,
        default: ""
    },
    oferta:{
        type:Boolean,
        default:false
    },
    precioOferta:{
        type:Number,
        defatul:0
    },
    utilidad: {
        type: String,
        default: "0"
    },
    precio_venta: {
        type: Number,
        default: 0 
    },
    unidad: {
        type: String,
        default: "U"
    },
    rubro:{
        type:Number,
        default:0
    },
    imgURL: String
})



module.exports = model('Producto', Producto);