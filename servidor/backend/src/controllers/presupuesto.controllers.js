const PresupuestoCTRL = {};

const Presupuesto = require("../models/presupuesto");


PresupuestoCTRL.cargarPresupuesto = async(req,res)=>{
    const now = new Date();
    req.body.fecha = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString();
    const presupuesto = new Presupuesto(req.body);
    let id = (await Presupuesto.find().sort({$natural:-1}).limit(1))[0];
    presupuesto._id = id ? id._id + 1 : 1;
    presupuesto.save();
    console.log(`Presupuesto ${req.body.nro_comp} cargado por el vendedor ${req.body.vendedor} en la maquina ${req.body.maquina} con la hora ${(new Date()).toLocaleString()}`);
    res.send(presupuesto)
}

PresupuestoCTRL.traerPresupuesto = async(req,res)=>{
    const {id:nro_comp} = req.params;
    const presupuesto = await Presupuesto.find({nro_comp:nro_comp});
    res.send(presupuesto[0])
}

PresupuestoCTRL.modificarPresupuesto = async(req,res) =>{
    const {id} = req.params;
    delete req.body._id
    const presupuesto = await Presupuesto.findOneAndUpdate({nro_comp:id},req.body);
    res.send(presupuesto)
}

PresupuestoCTRL.entreFechas = async(req,res)=>{
    const {id,desde,hasta} = req.params;
    const ventaARetornar = await Presupuesto.find({
        $and:[
            {fecha:{$gte: new Date(desde)}},
            {fecha:{$lte: new Date(hasta + "T23:59:59.000Z")}}
        ]})
    res.send(ventaARetornar)
}

PresupuestoCTRL.entreFechasConId = async(req,res)=> {
    const {id,desde,hasta} = req.params;
    const ventaARetornar =  await Presupuesto.find({
        $and:[
            {nro_comp:id},{fecha:{$gte: new Date(desde)}},
            {fecha:{$lte: new Date(hasta + "T23:59:59.000Z")}}
        ]})
    res.send(ventaARetornar)
}

PresupuestoCTRL.entreFechasConCliente = async(req,res) => {
    const {idCliente,desde,hasta} = req.params;
    const VentaAretornar = await Presupuesto.find({
        $and:[
            {cliente:idCliente},
            {fecha:{$gte: new Date(desde)}},
            {fecha:{$lte: new Date(hasta + "T23:59:59.000Z")}}
        ]});
    res.send(VentaAretornar);
};

PresupuestoCTRL.borrarPresupuesto = async(req,res) =>{
    const {id} = req.params;
    await Presupuesto.findOneAndDelete({nro_comp:id});
    res.send(`Presupuesto ${id} eliminado`)

};

PresupuestoCTRL.entreFechasConRazon = async(req, res) => {
    const { razon, desde, hasta} = req.params;

    const re = new RegExp(razon, 'i');

    try {
            const presupuestos = await Presupuesto.find({
        $and:
        [
            {nombreCliente: {$regex: re}},
            {fecha:{$gte: new Date(desde + "T00:00:00.000Z")}},
            {fecha:{$lte: new Date(hasta + "T23:59:59.000Z")}}
        ]
    });

        res.status(200).json({
            ok: true,
            presupuestos
        });
    } catch (error) {
        console.log(error)

        res.status(500).json({
            ok: false,
            msg: 'Hablar con el administrador'
        })
    }
};

module.exports = PresupuestoCTRL