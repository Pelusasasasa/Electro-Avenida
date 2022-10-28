const {Schema,model} = require('mongoose');

const MovCaja = new Schema({

    fecha:{
        type:Date,
        default:Date.now,
    },
    tMov:String,
    tPago:String,
    nro_comp:{
        type:String,
        default:""
    },
    desc:{
        type:String,
        default:""
    },
    imp:{
        type:Number,
        default:0
    },
    cuenta:String,
    idCuenta:String,
    obs:{
        type:String,
        default:""
    }

});

module.exports = model('MovCaja',MovCaja);