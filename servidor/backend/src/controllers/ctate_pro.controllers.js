const ctateCTRL = {};

const CtatePro = require('../models/Ctate_pro');

ctateCTRL.post = async(req,res)=>{
    const now = new Date();
    const p = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString();
    req.body.fecha = new Date(req.body.fecha + "T" + p.slice(11))
    const ctate = new CtatePro(req.body);
    await ctate.save();
    res.send(`Nueva ${req.body.rSocial} cuenta Conriente cargada`);
}

ctateCTRL.getdesdeDate = async(req,res)=>{
    const {codigo,desde} = req.params;
    const historicas = await CtatePro.find({
        $and:[
            {codProv:codigo},
            {fecha:{$gt:desde}}
        ]
    });
    res.send(historicas);
};

ctateCTRL.putForId = async(req,res)=>{
    const {id} = req.params;
    await CtatePro.findOneAndUpdate({_id:id},req.body);
    console.log(`Se modifico la historica de ${req.body.provedor}`);
    res.end();
}

module.exports = ctateCTRL