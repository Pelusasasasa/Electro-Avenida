const {Schema,model} = require('mongoose')

const cancelado = new Schema({
    _id:{
        type: String,
        required:true
    },
    fecha:{
        type: Date,
        default: Date.now
    },
    cliente: {
        type:String,
        default:""
    },
    productos: {
        type: [],
        dafult: []
    },
    vendedor: String
})

module.exports = model('Cancelados', cancelado);