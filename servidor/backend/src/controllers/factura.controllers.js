const facturaCTRL = {};

const Factura = require('../models/Factura');


facturaCTRL.post = async(req,res)=>{
    const factura = new Factura(req.body);
    await factura.save();
    console.log(`Factura ${req.body.concepto} con el importe ${req.body.imp} Cargado`)
    res.send(`Factura ${req.body.concepto} Cargada`);
}

facturaCTRL.getAll = async(req,res)=>{
    const facturas = await Factura.find();
    res.send(facturas);
}

facturaCTRL.getForId = async(req,res)=>{
    const {id} = req.params;
    const factura = (await Factura.find({_id:id}))[0];
    res.send(factura)
}

facturaCTRL.putForId = async(req,res)=>{
    const {id} = req.params;
    const factura = await Factura.findOneAndUpdate({_id:id},req.body);
    console.log(`Factura en cocepto de ${req.body.concepto} con el importe de ${req.body.imp} Modificado`);
    res.send("Factura Modificada");
};

module.exports = facturaCTRL;