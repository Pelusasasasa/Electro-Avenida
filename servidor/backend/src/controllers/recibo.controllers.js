const reciboCTRL = {};

const Recibo = require('../models/Recibo');

reciboCTRL.post = async(req,res)=>{
    const now = new Date();
    const p = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString();
    req.body.fecha = new Date(req.body.fecha.slice(0,10) + "T" + p.slice(11));
    const recibo = new Recibo(req.body);
    await recibo.save();
    console.log(`Recibo de ${req.body.cliente} cargado a la hora ${req.body.fecha}`);
    res.end();
};


reciboCTRL.getForCliente = async(req,res)=>{
    const {codigo} = req.params;
    const recibos = await Recibo.find({codigo:codigo});
    res.send(recibos);
}

reciboCTRL.getbetweenDates = async(req,res)=>{
    const {desde,hasta} = req.params;
    const recibos = await Recibo.find({
        $and:[
            {fecha:{$gte:desde}},
            {fecha:{$lte:new Date(hasta + "T23:59:59.000Z")}}
        ]
    });
    res.send(recibos)
}

reciboCTRL.getForNro_comp = async(req,res)=>{
    const {numero} = req.params;
    const recibo = await Recibo.findOne({
        nro_comp:numero
    });
    res.send(recibo);
};

reciboCTRL.getRecibosBetweenDates = async(req,res)=>{
    const {desde,hasta} = req.params;
    const recibos = await Recibo.find({
        $and:[
            {fecha:{$gte:new Date(desde + "T00:00:00.000Z")}},
            {fecha:{$lte:new Date(hasta + "T23:59:59.000Z")}},
            {tipo_comp:"Recibos"}
        ]
    });
    res.send(recibos);
}

module.exports = reciboCTRL;