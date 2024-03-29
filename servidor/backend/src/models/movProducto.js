const {model,Schema} = require('mongoose')


const movProducto = new Schema({
    _id: Number,
    codCliente:{
        type: String,
        default: "9999"
    },
    cliente:{
        type: String,   
        default: "A CONSUMIDOR FINAL"
    },
    codProd: {
        type: String,
        required:true
    },
    fecha:{
        type: Date,
        default: Date.now
    },
    descripcion:{
        type: String,
        required:true
    },
    ingreso:{
        type: Number,
        default: 0
    },
    egreso: {
        type: Number,
        default: 0
    },
    nro_comp: {
        type: String,
        default: ""
    },
    tipo_comp: String,
    tipo_pago:{
        type:String,
        default:""
    },
    iva:{
        type:String,
        default:"N"
    },
    stock:Number,
    precio_unitario: {
        type: Number,
        default: 0
    },
    total:{
        type: Number,
        default: 0
    },
    pago:String,
    costo:Number,
    total_costo:Number,
    vendedor:{
        type: String,
        default: ""
    },
    rubro:{
        type:Number,
        default:0
    }
})

module.exports = model('movProducto',movProducto)