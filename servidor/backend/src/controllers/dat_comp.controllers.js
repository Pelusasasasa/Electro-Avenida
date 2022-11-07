const datCompCTRL = {};

const DatComp= require('../models/Dat_comp');

datCompCTRL.post = async(req,res)=>{
    const datComp = new DatComp(req.body);
    await datComp.save();
    res.send(`Dato de Comprobante a la empresa ${req.body.empresa} con el importe $${req.body.total} cargado`);
}

module.exports = datCompCTRL;