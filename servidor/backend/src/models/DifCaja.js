const {Schema,model} = require('mongoose');

const DifCaja = new Schema({
    fecha:{
        type:Date,
        default:Date.now
    },
    hora:{
        type:String,
        require:true
    },
    importe:{
        type:Number,
        require:true
    },
    diferencia:{
        type:Number,
        require:true
    }
});

module.exports = model('DifCaja',DifCaja);