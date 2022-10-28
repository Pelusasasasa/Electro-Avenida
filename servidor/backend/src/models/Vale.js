const  {Schema,model} = require('mongoose');

const Vale = new Schema({
    fecha:{
        type:Date,
        default:Date.now
    },
    rsoc:{
        type:String,
        default:""
    },
    nro_comp:{
        type:String,
        default:""
    },
    concepto:{
        type:String,
        default:""
    },
    imp:{
        type:Number,
        default:0
    },
    tipo:{
        type:String,
        default:""
    },
    pago:{
        type:String,
        default:""
    }
});

module.exports = model('Vale',Vale);