const {model,Schema} = require('mongoose')

const Pedido = new Schema({
    fecha:{
        type: Date,
        default: Date.now
    },
    codigo:{
        type: String,
        required: false
    },
    producto:{
        type: String,
        required: false
    },
    marca:{
        type:String,
        required: true
    },
    provedor:{
        type:String,
        required: true
    },
    cantidad:{
        type: Number,
        default: 0
    },
    cliente:{
        type: String,
        default: ""
    },
    telefono:{
        type: String,
        default: ""
    },
    vendedor: {
        type: String,
        required: false
    },
    stock: {
        type: Number,
        required: false
    },
    estadoPedido: {
        type: String,
        default: "Sin Pedir"
    },
    observacion:{
     type:String,
     default:""       
    }
})


module.exports = model('Pedido',Pedido) 