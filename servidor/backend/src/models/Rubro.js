const {Schema,model} = require('mongoose');

const Rubro = new Schema({
    codigo:{
        type:Number,
        require:true
    },
    nombre:{
        type:String,
        require:true
    },
    subRubros:{
        type:Array,
        default:[]
    }
});


module.exports = model('Rubro',Rubro);