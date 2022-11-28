const {Schema,model} = require('mongoose');

const CtatePro = new Schema({
    fecha:{
        type:Date,
        default:Date.now
    },
    codProv:String,
    provedor:{
        type:String,
        default:""
    },
    tipo_comp:String,
    nro_comp:String,
    debe:{
        type:Number,
        default:0
    },
    haber:{
        type:Number,
        default:0
    },
    saldo:{
        type:Number,
        default:0
    },
    com_pago:{
        type:String,
        default:""
    },
    emp:{
        type:String,
        default:""
    },
    observaciones:{
        type:String,
        default:""
    }

});

module.exports = model('CtatePro',CtatePro);