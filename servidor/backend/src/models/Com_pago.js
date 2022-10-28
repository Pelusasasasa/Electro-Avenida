const {Schema,model} = require('mongoose');

const ComPago = new Schema({

    fecha:{
        type:Date,
        default:Date.now
    },
    codProv:String,
    rSocial:String,
    n_cheque:Number,
    banco:String,
    imp_cheque:Number,
    nro_comp:String,
    tipo_comp:String,
    imp_Fact:{
        type:Number,
        default:0
    },
    n_opago:Number

});

module.exports = model('ComPago',ComPago);