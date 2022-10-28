const ultimosCTRL = {};

const Ultimos = require('../models/Ultimos');


ultimosCTRL.post = async(req,res)=>{
    const ultimo = new Ultimos(req.body);
    await ultimo.save();
    res.send('ultimo guardado');
}

ultimosCTRL.get = async(req,res)=>{
    const ultimo = (await Ultimos.find())[0];
    res.send(ultimo)
};

ultimosCTRL.put = async(req,res)=>{
    (await Ultimos.findOneAndUpdate({_id:req.body._id},req.body));
    res.send("Ultimos modificados");
}
module.exports = ultimosCTRL;