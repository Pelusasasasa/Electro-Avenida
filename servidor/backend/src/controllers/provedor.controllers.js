const provedorCTRL = {};

const Provedor = require('../models/Provedor');


provedorCTRL.post = async(req,res)=>{
    const provedor = new Provedor(req.body);
    await provedor.save();
    res.send(`Provedor ${req.body.provedor} Cargado`);
};

provedorCTRL.id = async(req,res)=>{
    const ultimo = await Provedor.find().sort({$natural:-1}).limit(1);
    const id = ultimo.length !== 0 ? ultimo[0].codigo : 0;
    res.send(`${parseInt(id) + 1}`);
}

provedorCTRL.withSaldo = async(req,res)=>{
    const provedores = await Provedor.find({saldo:{$ne:0}},{codigo:1,saldo:1,nombre:1,provedor:1});
    res.send(provedores);
}

provedorCTRL.getAll = async(req,res)=>{
    const provedores = await Provedor.find().sort({nombre:1});
    res.send(provedores);
}

provedorCTRL.getOne = async(req,res)=>{
    const {codigo} = req.params;
    const provedor = await Provedor.find({codigo:codigo});
    res.send(provedor[0])
}

provedorCTRL.putOne = async(req,res)=>{
    const {codigo} = req.params;
    await Provedor.findOneAndUpdate({codigo:codigo},req.body);
    console.log(`Provedor ${codigo} Modificado`);
    res.send(`Provedor ${codigo} Modificado`);
}

provedorCTRL.deleteOne = async(req,res)=>{
    const {codigo} = req.params;
    await Provedor.findOneAndDelete({codigo:codigo});
    console.log(`Provedor ${codigo} Eliminado`);
    res.send(`Provedor ${codigo} Eliminado`);
}
module.exports = provedorCTRL;