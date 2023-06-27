const remitoCTRL = {};

const Remito = require('../models/Remito');

remitoCTRL.postRemito = async(req,res)=>{
    const remito = new Remito(req.body);
    await remito.save();
    const now = new Date();
    req.body.fecha = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString();
    console.log(`Remito con numero ${req.body.nro_comp} Cargado a las ${req.body.fecha}`);
    res.end();
}

remitoCTRL.getAllRemitos = async(req,res)=>{
    const remitos = await Remito.find();
    res.send(remitos);
}

remitoCTRL.getBeetweenDates = async(req,res)=>{
    const {desde,hasta} = req.params;
    const inicioDia = new Date(desde + "T00:00:00.000Z");
    const finDia = new Date(hasta + "T23:59:59.000Z");
    const remitos = await Remito.find({$and:[
        {fecha:{$gte:inicioDia}},
        {fecha:{$lte:finDia}}
    ]});
    res.send(remitos);
};

remitoCTRL.getForNumber = async(req,res)=>{
    const {numero} = req.params;
    const remito = await Remito.findOne({nro_comp:numero});
    res.send(remito);
}

module.exports  = remitoCTRL;