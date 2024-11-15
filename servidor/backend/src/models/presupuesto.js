const {model,Schema} = require("mongoose")

const Presupuesto = new Schema({
    _id:Number,
    fecha:{
        type: Date,
        default: Date.now
    },
    cliente:{
        type: String,
        default: "9999"
    },
    nombreCliente:{
        type: String,
        default: "A Consumidor Final",
        set: (value) => value.toUpperCase()
    },
    direccion:{
        type:String,
        default: '',
        set: (value) => value.toUpperCase()
    },
    localidad:{
        type: String,
        default: '',
        set: (value) => value.toUpperCase()
    },
    telefono:{
        type: String,
        default: '',
    },
    dnicuit:{
        type: String,
        default: '',
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