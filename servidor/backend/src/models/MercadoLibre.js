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
    utilidad: {
        type: Number,
        default: 0
    },
    precioML: {
        type: Number,
        required: true
    },
    stockML: {
        type: Number,
        required: true
    },
    tipoVenta: {
        type: String,
        default: 'UNIDAD',
        set: value => value.toUpperCase().trim()
    },
    unidadPack: {
        type: Number,
        default: 1
    }

});

module.exports = model('MercadoLibre', mercadoLibre);