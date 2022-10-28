const {Schema,model} = require('mongoose');

const CtatePro = new Schema({
    fecha:{
        type:Date,
        default:Date.now
    },
    codProv:String,
    rSocial:{
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
    com_pago:String,
    emp:{
        type:String,
        default:""
    },
    imp_a:{
        type:Number,
        default:0
    },
    f_venc:{
        type:Date,
        default:Date.now
    },
    documento:{
        type:String,
        default:""
    }
});

module.exports = model('CtatePro',CtatePro);