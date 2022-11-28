const movCajaCTRL = {};

const MovCaja = require('../models/movCaja');

movCajaCTRL.post = async(req,res)=>{
    const movCaja = new MovCaja(req.body);
    await movCaja.save();
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
    console.log(desde)
    const movimientos = await MovCaja.find({
        $and:[
            {fecha:{$gte:new Date(desde)}},
            {fecha:{$gte:new Date(hasta)}},
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
    console.log(total)
    res.send(`${total}`);
}

module.exports = movCajaCTRL; 