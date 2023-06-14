const canceladosCTRL = {}

const Cancelados = require('../models/cancelados')


canceladosCTRL.traerCancelados = async(req,res)=>{
    const cancelados = await Cancelados.find()
    res.send(cancelados)
}

canceladosCTRL.CargarCancelado = async(req,res)=>{
    const now = new Date();
    req.body.fecha = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString();
    const cancelado = new Cancelados(req.body)
    await cancelado.save();
    res.send("Cancelado Guardado")
}

canceladosCTRL.traerTamanio = async(req,res)=>{
    const cancelado = await Cancelados.find();
    const tamanio =  cancelado.length;
    res.send(`${tamanio}`);
}

canceladosCTRL.traerEntreFechas = async(req,res)=>{
    const {desde,hasta} = req.params;
    const ventasCanceladas = await Cancelados.find({
        $and:[
            {fecha:{$gte: new Date(desde)}},
            {fecha:{$lte: new Date(hasta + "T23:59:59.000Z")}}
        ]
    })
    res.send(ventasCanceladas)
}

module.exports = canceladosCTRL;