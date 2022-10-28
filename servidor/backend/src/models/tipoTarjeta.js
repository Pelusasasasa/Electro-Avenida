const {model,Schema} = require('mongoose');

const tipoTarjeta = new Schema({
    nombre:String
});

module.exports = model('tipoTarjeta',tipoTarjeta)