const {Schema,model} = require('mongoose');

const Ultimos = new Schema({
    efectivoCaja:{
        type:Number,
        default:0
    },
    cheques:{
        type:Number,
        default:0
    },
    cien:{
        type:Number,
        default:0
    },
    cincuenta:{
        type:Number,
        default:0
    },
    veinte:{
        type:Number,
        default:0
    },
    diez:{
        type:Number,
        default:0
    },
    monedas:{
        type:Number,
        default:0
    },
    guardado:{
        type:Number,
        default:0
    },
    uno:{
        type:Number,
        default:0
    },
    cambioCaja:{
        type:Number,
        default:0
    },
    ceroVeinticinco:{
        type:Number,
        default:0
    },
    ceroCincuenta:{
        type:Number,
        default:0
    },
    maleta:{
        type:Number,
        default:0
    },
    dolares:{
        type:Number,
        default:0
    },
});


module.exports = model('Ultimos',Ultimos);