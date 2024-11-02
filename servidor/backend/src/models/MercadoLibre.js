const { Schema, model } = require("mongoose");

const MercadoLibre = new Schema({
    gananciaML: {
        type: Number,
        require: true,
        default: 0 
    },
    porcentajeDescuentoML: {
        type: Number,
        require: true,
        default: 0
    },
    envio:{
        type: Number,
        require: true,
        default: 0
    },
    valorPrimerCostoFijo:{
        type: Number,
        require: true,
        default: 0
    },
    valorSegundoCostoFijo:{
        type: Number,
        require: true,
        default: 0
    },
    primerCostoFijo:{
        type: Number,
        require: true,
        default: 0
    },
    segundoCostoFijo:{
        type: Number,
        require: true,
        default: 0
    },
    refreshToken:{
        type: String,
        
    },
    autherizacion:{
        type: String,
        default: ''
    }
});

module.exports = model('MercadoLibre', MercadoLibre);

