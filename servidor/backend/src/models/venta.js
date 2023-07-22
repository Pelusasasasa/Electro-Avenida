const {model,Schema} = require("mongoose")


const Venta = new Schema({
    _id:{
        type: Number,
        required: true
    },
    fecha:{
        type: Date,
        default: Date.now
    },
    nombreCliente: {
        type: String,
        default: "A Consumidor Final"
    },
    gravado:{
        type:Number,
    },
    ivanormal:{
        type:Number,
    },
    direccion:String,
    localidad:String,
    cliente: {
        type: String,
        default:"9999"
    },
    cod_comp: {
        type: Number,
    },
    tipo_comp: {
        type: String,
        required: false
    },
    nro_comp: {
        type: String,
        required: false
    },
    comprob: {
        type: String,
    },
    productos: {
        type: [],
        required: false
    },
    tipo_pago: String,
    cod_doc: Number, //Blanco
    dnicuit: String, //Blanco
    condIva: String, //Blanco
    observaciones: {
        type: String,
        default: ""
    },
    descuento: Number,
    precioFinal: {
        type: Number,
        required: true
    },
    vendedor: String,
    empresa: String,
    numeroAsociado: String,
    gravado21: Number,
    gravado105: Number,
    iva21:Number,
    iva105:Number,
    cant_iva:Number
})

module.exports = model('Venta',Venta)