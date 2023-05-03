const prestamoCTRL = {};

const Prestamo = require('../models/Prestamo');

prestamoCTRL.post = async(req,res)=>{
    const now = new Date();
    const p = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString();
    req.body.fecha = new Date(req.body.fecha.slice(0,10) + "T" + p.slice(11));
    const prestamo = new Prestamo(req.body);
    await prestamo.save();
    console.log(`Prestamo de ${req.body.cliente} cargado a la hora ${req.body.fecha}`);
    res.end();
};

prestamoCTRL.getBetweenDate = async(req,res)=>{
    const {desde,hasta} = req.params;
    console.log(new Date(desde + "T00:00:00"));
    console.log(hasta);
    const prestamos = await Prestamo.find({
        $and:[
            {fecha: {$gte: new Date(desde + "T00:00:00.000Z")}},
            {fecha: {$lte: new Date(hasta + "T23:59:59.000Z")}}
        ]
    });
    res.send(prestamos);
};

module.exports = prestamoCTRL;