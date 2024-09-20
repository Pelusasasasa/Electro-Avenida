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
        console.log("Error en " + req.body.fecha + "Con el numero de comprobante " + req.body.nro_comp + "Y tipo " + req.body.tPago + "Y descripcion " + req.body.desc );
        console.log(error);
    }
    console.log(`Movimiento de caja ${req.body.desc} cargado por el vendedor ${req.body.vendedor} en la maquina ${req.body.maquina} con la hora ${(new Date()).toLocaleString()}`);
    res.send(`Moviemiento de caja Cargado`);
}

movCajaCTRL.getAll = async(req,res)=>{
    const movCajas = await MovCaja.find();
    res.send(movCajas);
}

movCajaCTRL.getBetweenDates = async(req,res)=>{
    const {desde,hasta} = req.params;
    let movimientos = [];
    try {
        movimientos = await MovCaja.find({
            $and:[
                {fecha:{$gte:new Date(desde + "T00:00:00.000Z")}},
                {fecha:{$lte:new Date(hasta + "T23:59:59.000Z")}}
            ]
        });
    } catch (error) {
        console.log("Error en la linea 35")
    }
    res.send(movimientos)
};

movCajaCTRL.put = async(req,res)=>{
    const arreglo = req.body;
    for await(let elem of arreglo){
        try {
            await MovCaja.findOneAndUpdate({_id:elem._id},elem);
        } catch (error) {
            console.log(error);
            console.log(`Movimiento de caja con el numero de comprobante: ${elem.nro_comp} no fue modificado`)
        }
        console.log(`Movimiento de caja ${elem._id} Modificado`);
    };
    res.send('Movimientos de cajas modificados');
};

movCajaCTRL.getForDateAndCuenta = async(req,res)=>{
    const {desde,hasta,idCuenta} = req.params;
    let movimientos;
    if (idCuenta === "todos") {
        try {
            movimientos = await MovCaja.find({
                $and:[
                    {fecha:{$lte:new Date(hasta)}},
                    {fecha:{$gte:new Date(desde)}},
                ]
            });
        } catch (error) {
            console.log("Error en la linea 61")
        }
        res.send(movimientos);
    }else{
        try {
            movimientos = await MovCaja.find({
                $and:[
                    {fecha:{$lte:new Date(hasta)}},
                    {fecha:{$gte:new Date(desde)}},
                    {idCuenta:idCuenta}
                ]
            });
        } catch (error) {
            console.log('Error en la linea 74');
        }
        res.send(movimientos);
    }
};

movCajaCTRL.getPriceBetweenDates = async(req,res)=>{
    const {desde,hasta} = req.params;
    let movimientos
    try {
        movimientos = await MovCaja.find({
            $and:[
                {fecha:{$gte:new Date(desde)}},
                {fecha:{$lte:new Date(hasta)}},
            ]
        });   
    } catch (error) {
        console.log(`Error en la linea 82`)
    }
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
    try {
        await MovCaja.findOneAndUpdate({_id:id},req.body);
    } catch (error) {
        console.log(`El error estuvo a la hora ${new Date()} en el movimineto ${req.body.nro_comp} de ${req.body.cliente}`)
        console.log(error)
    }
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