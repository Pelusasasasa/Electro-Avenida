const compPagoCTRL = {};

const ComPago = require('../models/Com_pago');

compPagoCTRL.post = async(req,res)=>{
    const now = new Date();
    req.body.fecha = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString();
    const comprobante = new ComPago(req.body);
    await comprobante.save();
    res.send(`Comprobante ${req.body.rSocial} Cargado`);
}


module.exports = compPagoCTRL;