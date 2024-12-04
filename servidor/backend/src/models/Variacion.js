const {Schema, model} = require('mongoose');

const Variacion = new Schema({
    
    variacionId: {
        type: String,
        required: true,
        unique: true
    },
    precio: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    publicacion:{
        type: Schema.Types.ObjectId,
        ref: 'MercadoLibre'
    }

});

module.exports = model('Variacion', Variacion);
