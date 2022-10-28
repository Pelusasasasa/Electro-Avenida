const tarjetaCTRL = {};

const Tarjeta = require('../models/Tarjeta');

tarjetaCTRL.post = async(req,res)=>{
    const tarjeta = new Tarjeta(req.body);
    await tarjeta.save();
    res.send(`Tarjeta Con el importe ${req.body.imp} de ${req.body.tarjeta} Cargada`)
}

tarjetaCTRL.getAll = async(req,res)=>{
    const tarjetas = await Tarjeta.find();
    res.send(tarjetas);
};

tarjetaCTRL.getForId = async(req,res)=>{
    const {id} = req.params;
    const tarjeta = (await Tarjeta.find({_id:id}))[0];
    res.send(tarjeta);
}

tarjetaCTRL.putForId = async(req,res)=>{
    const {id} = req.params;
    const tarjeta = (await Tarjeta.findOneAndUpdate({_id:id},req.body))
    res.send(tarjeta);
}

tarjetaCTRL.deleteId = async(req,res)=>{
    const {id} = req.params;
    const tarjeta = await Tarjeta.findByIdAndDelete({_id:id});
    console.log(`Tarjeta ${id} Eliminada`);
    res.send('Tarjeta Eliminada');
}

module.exports = tarjetaCTRL;