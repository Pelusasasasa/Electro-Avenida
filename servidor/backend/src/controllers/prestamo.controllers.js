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

prestamoCTRL.getForNumber = async(req,res)=>{
    const {numero} = req.params;
    const prestamo = await Prestamo.findOne({nro_comp:numero});
    res.send(JSON.stringify(prestamo));
};

prestamoCTRL.putForNumber = async(req,res)=>{
    const {numero} = req.params;
    await Prestamo.findOneAndUpdate({nro_comp:numero},req.body);
    console.log(`Prestamo con el numero ${numero} modificado a la hora ${new Date()}`)
    res.end();
};

prestamoCTRL.getBetweenDate = async(req,res)=>{
    const {desde,hasta} = req.params;
    console.log(new Date(desde + "T00:00:00"));
    const prestamos = await Prestamo.find({
        $and:[
            {fecha: {$gte: new Date(desde + "T00:00:00.000Z")}},
            {fecha: {$lte: new Date(hasta + "T23:59:59.000Z")}},
            {anulado:false}
        ]
    });
    res.send(prestamos);
};

prestamoCTRL.getAnuladosBetweenDate = async(req,res)=>{
    const {desde,hasta} = req.params;
    const prestamos = await Prestamo.find({
        $and:[
            {fecha: {$gte: new Date(desde + "T00:00:00.000Z")}},
            {fecha: {$lte: new Date(hasta + "T23:59:59.000Z")}},
            {anulado:true}
        ]
    });
    res.send(prestamos)
}

module.exports = prestamoCTRL;