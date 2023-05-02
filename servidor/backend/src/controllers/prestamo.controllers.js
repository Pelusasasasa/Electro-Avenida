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

module.exports = prestamoCTRL;