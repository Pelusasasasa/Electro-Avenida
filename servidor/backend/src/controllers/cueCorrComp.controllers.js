const cuentaCompCTRL = {};

const CuentaComp = require('../models/CueCorrComp');

cuentaCompCTRL.traerCompensada = async(req,res)=>{
    const {id} = req.params;
    let compensada = await CuentaComp.find({$and:[{nro_comp:id},{saldo:{$ne:0}}]});
    compensada = compensada.filter(compensada=>compensada.saldo !== 0);
    res.send(compensada);
}

cuentaCompCTRL.traerCompensadasPorCliente = async(req,res)=>{
    const {codigo} = req.params;
    let compensadas = await CuentaComp.find({$and:[{codigo:codigo},{saldo:{$ne:0}}]});
    compensadas = compensadas.filter(compensada=>compensada.saldo !== 0);
    res.send(compensadas);
}

cuentaCompCTRL.cargarCompensada = async(req,res)=>{
    const now = new Date();
    req.body.fecha = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString();
    const nuevaCompensada = new CuentaComp(req.body);
    let id = (await CuentaComp.find().sort({$natural:-1}).limit(1))[0]
    nuevaCompensada._id = id ? id._id + 1 : 1; 
    nuevaCompensada.save();
    console.log(`Compensada ${req.body.nro_comp} al cliente ${req.body.cliente} cargado a la hora ${req.body.fecha}`)
    res.send("Nueva compensada cargada");
}
cuentaCompCTRL.modificarCompensadaPorNumero = async(req,res)=>{
    const {numero} = req.params;
    delete req.body._id;
    await CuentaComp.findOneAndUpdate({nro_comp:numero},req.body);
    console.log(`Compensada de ${req.body.cliente} con numero ${req.body.nro_comp} Modificado`);
    res.send(`Compensada ${numero} Modificada`);
}

cuentaCompCTRL.borrarCompensada = async(req,res)=>{
    const {id} = req.params;
    await CuentaComp.findOneAndDelete({nro_comp:id});
    res.send(`Compensada ${id} Eliminada`);
}

cuentaCompCTRL.traerCompensadasPorNumero = async(req,res)=>{
    const {numero} = req.params;
    const cuentas = await CuentaComp.find({nro_comp:numero});
    res.send(cuentas);
}

cuentaCompCTRL.modificarCompensada = async(req,res)=>{
    const {id} = req.params;
    await CuentaComp.findByIdAndUpdate({_id:id},req.body);
    console.log(`Compensada de ${req.body.cliente} con numero ${req.body.nro_comp} Modificada`);
    res.send(`Compensada de ${req.body.cliente} con numero ${req.body.nro_comp} Modificada`);
};


cuentaCompCTRL.modificarPorNumeroYCliente = async(req,res)=>{
    const {numero,cliente} = req.params;
    await CuentaComp.findOneAndUpdate({$and:[
        {nro_comp:numero},
        {codigo:cliente}
    ]},req.body);
    res.end();
}
module.exports = cuentaCompCTRL