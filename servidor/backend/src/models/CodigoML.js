const {Schema, model} = require('mongoose');

const CodigoML = new Schema({

    authorizacion: String,
    seller_id: String,
    url: String,
    client_id: String,
    cliente_secret: String,
    code: String,
    refresh_token: String,
    redirect_uri: String,

});

module.exports = model('CodigoML', CodigoML);