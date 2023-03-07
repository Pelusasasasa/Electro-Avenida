const remitoCTRL = {};

const Remito = require('../models/Remito');

remitoCTRL.postRemito = async(req,res)=>{
    const remito = new Remito(req.body);
    await remito.save();
    const now = new Date();
    req.body.fecha = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString();
    console.log(`Remito con numero ${req.body.nro_comp} Cargado a las ${req.body.fecha}`);
    res.end();
}

remitoCTRL.getAllRemitos = async(req,res)=>{
    const remitos = await Remito.find();
    res.send(remitos);
}

module.exports  = remitoCTRL;