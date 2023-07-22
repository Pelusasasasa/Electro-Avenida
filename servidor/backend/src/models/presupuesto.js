const {model,Schema} = require("mongoose")

const Presupuesto = new Schema({
    _id:Number,
    fecha:{
        type: Date,
        default: Date.now
    },
    nombreCliente:{
        type: String,
        default: "A Consumidor Final"
    },
    cliente:{
        type: String,
        default: "9999"
    },
    tipo_comp: {
        type: String,
        require: true
    },
    tipo_pago: {
        type: String,
        require:true
    },
    nro_comp:{
        type:String,
        require:true
    },
    observaciones:{
        type:String,
        default: ""
    },
    descuento:{
        type:Number,
        default: 0
    },
    precioFinal:{
        type:Number,
        require
    },
    vendedor:String,
    empresa:String,
    productos:{
        type:[],
        require:true
    }
})

module.exports = model("Presupuesto",Presupuesto)