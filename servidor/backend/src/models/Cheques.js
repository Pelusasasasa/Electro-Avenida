const {model,Schema} = require('mongoose');

const Cheque = new Schema({
    f_recibido:{
        type:Date,
        default:Date.now
    },
    n_cheque:String,
    banco:{
        type:String,
        default:""
    },
    plaza:{
        type:String,
        default:""
    },
    f_cheque:{
        type:Date
    },
    i_cheque:{
        type:Number,
        default:0
    },
    ent_por:{
        type:String,
        default:""
    },
    entreg_a:{
        type:String,
        default:""
    },
    domicilio:{
        type:String,
        default:""
    },
    telefono:{
        type:String,
        default:""
    },
    tipo:{
        type:String,
        default:""
    },
    fechaPago:{
        type:Date
    },
    vendedor:String
});

module.exports = model('Cheque',Cheque)
