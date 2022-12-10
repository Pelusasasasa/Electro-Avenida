const ctateCTRL = {};

const CtatePro = require('../models/Ctate_pro');

ctateCTRL.post = async(req,res)=>{
    const now = new Date();
    req.body.fecha = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString();
    const ctate = new CtatePro(req.body);
    await ctate.save();
    res.send(`Nueva ${req.body.rSocial} cuenta Conriente cargada`);
}

module.exports = ctateCTRL