const movCajaCTRL = {};

const MovCaja = require('../models/movCaja');

movCajaCTRL.post = async(req,res)=>{
    const now = new Date();
    const p = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString();
    req.body.fecha = new Date(req.body.fecha.slice(0,10) + "T" + p.slice(11));
    const movCaja = new MovCaja(req.body);
    try {
        await movCaja.save();
    } catch (error) {
        console.log(error);
        console.log("Error en " + req.body.fecha);
    }
    console.log(`Movimiento de caja ${req.body.desc} cargado a la hora ${req.body.fecha}`);
    res.send(`Moviemiento de caja Cargado`);
}

movCajaCTRL.getAll = async(req,res)=>{
    const movCajas = await MovCaja.find();
    res.send(movCajas);
}

movCajaCTRL.getBetweenDates = async(req,res)=>{
    const {desde,hasta} = req.params;
    const movimientos = await MovCaja.find({
        $and:[
            {fecha:{$gte:new Date(desde)}},
            {fecha:{$lte:new Date(hasta)}}
        ]
    });
    res.send(movimientos)
}

movCajaCTRL.put = async(req,res)=>{
    const arreglo = req.body;
    for await(let elem of arreglo){
        await MovCaja.findOneAndUpdate({_id:elem._id},elem);
        console.log(`Movimiento de caja ${elem._id} Modificado`);
    };
    res.send('Movimientos de cajas modificados');
}


movCajaCTRL.getForDateAndCuenta = async(req,res)=>{
    const {desde,hasta,idCuenta} = req.params;
    if (idCuenta === "todos") {
        const movimientos = await MovCaja.find({
            $and:[
                {fecha:{$lte:new Date(hasta)}},
                {fecha:{$gte:new Date(desde)}},
            ]
        }) ;
        res.send(movimientos);
    }else{
        const movimientos = await MovCaja.find({
            $and:[
                {fecha:{$lte:new Date(hasta)}},
                {fecha:{$gte:new Date(desde)}},
                {idCuenta:idCuenta}
            ]
        }) ;
        res.send(movimientos);
    }
};

movCajaCTRL.getPriceBetweenDates = async(req,res)=>{
    const {desde,hasta} = req.params;
    const movimientos = await MovCaja.find({
        $and:[
            {fecha:{$gte:new Date(desde)}},
            {fecha:{$lte:new Date(hasta)}},
        ]
    });
    let total = 0;
    for await(let movimiento of movimientos){
        if(movimiento.tMov === "I"){
            total += movimiento.imp; 
        }else{
            total -= movimiento.imp;
        }
    }
    res.send(`${total}`);
}

movCajaCTRL.getForId = async(req,res)=>{
    const {id} = req.params;
    const movimiento = await MovCaja.findOne({_id:id});
    res.send(movimiento);
}

movCajaCTRL.putForId = async(req,res)=>{
    const {id} = req.params;
    await MovCaja.findOneAndUpdate({_id:id},req.body);
    res.end();
}

movCajaCTRL.deleteForID = async(req,res)=>{
    const {id} = req.params;
    await MovCaja.findOneAndDelete({_id:id});
    res.end();
}

movCajaCTRL.getForNotPased = async(req,res)=>{
    const movimientos = await MovCaja.find({pasado:false});
    res.send(movimientos);
}

module.exports = movCajaCTRL; 