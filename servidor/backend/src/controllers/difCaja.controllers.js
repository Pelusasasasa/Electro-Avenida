const difCajaCTRL = {};

const DifCaja = require('../models/DifCaja');

difCajaCTRL.post = async(req,res)=>{
    const difCaja = new DifCaja(req.body);
    await difCaja.save();
    console.log(`Diferencia de caja cargada por ${req.body.vendedor} en la maquina ${req.body.maquina} con la fecha y hora ${(new Date()).toLocaleString()}`);
    res.end();
};

difCajaCTRL.getAll = async(req,res)=>{
    const difCaja = await DifCaja.find();
    res.send(difCaja);
};

difCajaCTRL.getForId = async(req,res)=>{
    const {id} = req.params;
    const difCaja = await DifCaja.findOne({_id:id});
    res.send(JSON.stringify(difCaja));
};

difCajaCTRL.putForId = async(req,res)=>{
    const {id} = req.params;
    console.log(id)
    const difCaja = await DifCaja.findOneAndUpdate({_id:id},req.body);
    console.log(`Diferencia de caja modificada por ${req.body.vendedor} en la maquina ${req.body.maquina} con la fecha y hora ${(new Date()).toLocaleString()}`);;
    res.end();
};

difCajaCTRL.deletForId = async(req,res)=>{
    const {id} = req.params;
    let bandera;
    try {
        await DifCaja.findOneAndDelete({_id:id});
        bandera = true;
        console.log(`Diferencia de caja se elimino`);
    } catch (error) {
        bandera = error;
    }
    res.send(bandera);
};

module.exports = difCajaCTRL;