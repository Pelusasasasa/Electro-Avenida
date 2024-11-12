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
    costo: {
        type: String,
        default: "0"
    },
    costodolar: {
        type: Number,
        default: 0
    },
    datos:{
        type:Array,
        default:[]
    },
    descripcion: {
        type: String,
        required: true,
        set: ( valor ) => valor.toUpperCase().trim()
    },
    destacado:{
        type:Boolean,
        default:false
    },
    imgURL: String,
    impuestos: {
        type: String,
        default: "0"
    },
    iva: {
        type: String,
        dafault: "N"
    },
    marca: {
        type: String,
        default: "",
        set: ( valor ) => valor.toUpperCase().trim()
    },
    observacion: {
        type: String,
        default: "",
        set: ( valor ) => valor.toUpperCase().trim()
    },
    oferta:{
        type:Boolean,
        default:false
    },
    provedor: {
        type: String,
        default: "",
        set: ( valor ) => valor.toUpperCase().trim()
    },
    precioOferta:{
        type:Number,
        defatul:0
    },
    precio_venta: {
        type: Number,
        default: 0 
    },
    rubro:{
        type:Number,
        default:0
    },
    subRubro:{
        type:String,
        default:0
    },
    stock: {
        type: String,
        default: "0"
    },
    unidad: {
        type: String,
        default: "U"
    },
    utilidad: {
        type: String,
        default: "0"
    },
    web: {
        type: Boolean,
        default: true
    }
});

module.exports = model('Producto', Producto);