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
    const now = new Date();//creamos la fecha de hoy y la guadamos
    const fecha = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString();//sacamos la hora excacta en argentina
    const date = new Date(desde + "T00:00:00.000Z");//creamos una constante que tenga la fecha que recibimos y la hora actual
    const historicas = await CtatePro.find({
        $and:[
            {codProv:codigo},
            {fecha:{$gte:date}}
        ]
    });
    res.send(historicas);
};

ctateCTRL.getForNumeroComp = async(req,res)=>{
    const {numero} = req.params;
    const cuenta = await CtatePro.findOne({nro_comp:numero});
    res.send(cuenta)
};

ctateCTRL.putForId = async(req,res)=>{
    const {id} = req.params;
    await CtatePro.findOneAndUpdate({_id:id},req.body);
    console.log(`Se modifico la historica de ${req.body.provedor}`);
    res.end();
}

module.exports = ctateCTRL