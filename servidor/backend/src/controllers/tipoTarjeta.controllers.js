const tipoCTRL = {};

const Tipo = require('../models/tipoTarjeta');

tipoCTRL.post = async(req,res)=>{
    const tipo = new Tipo(req.body);
    await tipo.save();
    res.send(`Tipo de Tarjeta ${req.body.nombre} cargado`);
};

tipoCTRL.getsAll = async(req,res)=>{
    const tipos = await Tipo.find({},{_id:0,__v:0});
    res.send(tipos);
}

module.exports = tipoCTRL;