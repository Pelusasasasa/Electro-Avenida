const {Schema,model} = require('mongoose');

const DatComp = new Schema({
    fecha_comp:{
        type:Date,
        default: Date.now
    },
    fecha_imput:{
        type:Date,
        default: Date.now
    },
    tipo_comp:{
        type:String,
        default: ""
    },
    nro_comp:{
        type:String,
        default: "0000-00000000"
    },
    codProv:{
        type:String,
        default:""
    },
    provedor:{
        type:String,
        default:""
    },
    empresa:String,
    cuit:Number,
    netoNoGravado:{
        type:Number,
        default:0
    },
    netoGravado:{
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
    r_iva_c:{
        type:Number,
        default:0
    },
    total:{
        type:Number,
        default:0
    }

});

module.exports = model('DatComp',DatComp);