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
    cliente: {
        type: String,
        default:"9999"
    },
    nombreCliente: {
        type: String,
        default: "A Consumidor Final",
        set: (value) => value.toUpperCase() 
    },
    
    direccion:{
        type: String,
        default: "",
        set: (value) => value.toUpperCase()
    },
    localidad: {
        type: String,
        default: "",
        set: (value) => value.toUpperCase()
    },

    gravado:{
        type:Number,
    },
    ivanormal:{
        type:Number,
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
    
    tipo_pago: String,
    cod_doc: Number, //Blanco
    dnicuit: String, //Blanco
    condIva: String, //Blanco
    observaciones: {
        type: String,
        default: "",
        set: ( valor ) => valor.toUpperCase()
    },
    
    descuento: Number,
    precioFinal: {
        type: Number,
        required: true
    },

    numeroAsociado: String,
    gravado21: Number,
    gravado105: Number,
    iva21:Number,
    iva105:Number,
    cant_iva:Number,
    qr:String,
    cae:String,
    vencimientoCae:String,

    vendedor: String,
    empresa: String,
})

module.exports = model('Venta',Venta)