const compPagoCTRL = {};

const ComPago = require('../models/Com_pago');

compPagoCTRL.getForCodProv = async (req, res) => {
    const {codigo} = req.params;
    const comprobantes = await ComPago.find({codProv: codigo});
    res.send(comprobantes)
};

compPagoCTRL.getForNumber = async (req, res) => {
    const {number} = req.params;
    const comprobante = await ComPago.findOne({number: number});
    res.send(comprobante);
};

compPagoCTRL.post = async(req,res)=>{
    const now = new Date();
    req.body.fecha = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString();
    const comprobante = new ComPago(req.body);
    await comprobante.save();
    res.send(`Comprobante ${req.body.rSocial} Cargado`);
};


module.exports = compPagoCTRL;