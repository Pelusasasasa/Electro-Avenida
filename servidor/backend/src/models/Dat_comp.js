const {Schema,model} = require('mongoose');

const DatComp = new Schema({
    f_comp:{
        type:Date,
        default: Date.now
    },
    f_imput:{
        type:Date,
        default: Date.now
    },
    t_comp:String,
    l_comp:String,
    n_comp:String,
    codProv:String,
    empresa:String,
    cuit:Number,
    noGrava:{
        type:Number,
        default:0
    },
    gravado:{
        type:Number,
        default:0
    },
    tasaIva:{
        type:Number,
        default:0
    },
    iva:{
        type:Number,
        default:0
    },
    p_dgr_c:{
        type:Number,
        default:0
    },
    p_iva_c:{
        type:Number ,
        default:0
    },
    r_dgr_c:{
        type:Number,
        default:0
    },
    p_dgr_c:{
        type:Number,
        default:0
    },
    total:{
        type:Number,
        default:0
    }

});

module.exports = model('DatComp',DatComp);