const { model, Schema } = require('mongoose')

const Pedido = new Schema({
    fecha: {
        type: Date,
        default: Date.now
    },
    codigo: {
        type: Schema.Types.String,
        ref: 'Producto',
        required: false
    },
    producto: {
        type: 'String',
        set: val => val.toUpperCase().trim(),
        default: ''
    },
    cantidad: {
        type: Number,
        default: 0
    },
    cliente: {
        type: String,
        default: "",
        set: val => val.toUpperCase().trim()
    },
    telefono: {
        type: String,
        default: ""
    },
    vendedor: {
        type: String,
        required: false,
        set: val => val.toUpperCase().trim()
    },
    estadoPedido: {
        type: Number,
        default: 0
    },
    observacion: {
        type: String,
        default: ""
    }
})


module.exports = model('Pedido', Pedido) 