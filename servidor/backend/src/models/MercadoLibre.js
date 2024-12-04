<<<<<<< HEAD
const {Schema, model} = require('mongoose');

const mercadoLibre = new Schema({
    codigoML:{
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    fecha:{
        type: Date,
        required: true,
        default: Date.now()
    },
    
    descripcion: {
        type: String,
        required: true,
        trim: true,
        set: value => value.toUpperCase()
    },

    categoria: {
        type: String,
        default: ""
    },
    precioML: {
        type: Number,
        required: true
    },
    variaciones: {
        type: Schema.Types.ObjectId,
        ref: 'Variacion'
    },
    esCatalogo: {
        type: Boolean,
        required: true
    }

});

=======
const {Schema, model} = require('mongoose');

const mercadoLibre = new Schema({
    codigoML:{
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    fecha:{
        type: Date,
        required: true,
        default: Date.now()
    },
    codProd: {
        type: String,
        required: true,
        trim: true
    },
    descripcion: {
        type: String,
        required: true,
        trim: true,
        set: value => value.toUpperCase()
    },
    categoria: {
        type: String,
        default: ""
    },
    precioML: {
        type: Number,
        required: true
    },
    stockML: {
        type: Number,
        required: true
    }

});

>>>>>>> mercadoLibre
module.exports = model('MercadoLibre', mercadoLibre);