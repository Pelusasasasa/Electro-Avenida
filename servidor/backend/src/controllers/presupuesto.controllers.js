const PresupuestoCTRL = {};

const Presupuesto = require("../models/presupuesto");


PresupuestoCTRL.cargarPresupuesto = async(req,res)=>{
    const now = new Date();
    req.body.fecha = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString();
    const presupuesto = new Presupuesto(req.body);
    let id = (await Presupuesto.find().sort({$natural:-1}).limit(1))[0];
    presupuesto._id = id ? id._id + 1 : 1;
    console.log(req.body.fecha);
    console.log(presupuesto)
    presupuesto.save();
    console.log(`Presupuesto ${req.body.nro_comp} guardado`)
    res.send(presupuesto)
}

PresupuestoCTRL.traerPresupuesto = async(req,res)=>{
    const {id:nro_comp} = req.params;
    const presupuesto = await Presupuesto.find({nro_comp:nro_comp});
    res.send(presupuesto[0])
}

PresupuestoCTRL.modificarPresupuesto = async(req,res) =>{
    console.log(req.params)
    const {id} = req.params;
    delete req.body._id
    const presupuesto = await Presupuesto.findOneAndUpdate({nro_comp:id},req.body);
    res.send(presupuesto)
}

PresupuestoCTRL.entreFechas = async(req,res)=>{
    const {id,desde,hasta} = req.params;
    const ventaARetornar = await Presupuesto.find({$and:[{fecha:{$gte: new Date(desde)}},{fecha:{$lte: new Date(hasta)}}]})
    res.send(ventaARetornar)
}

PresupuestoCTRL.entreFechasConId = async(req,res)=> {
    const {id,desde,hasta} = req.params;
    console.log(req.params)
    const ventaARetornar =  await Presupuesto.find({$and:[{nro_comp:id},{fecha:{$gte: new Date(desde)}},{fecha:{$lte: new Date(hasta)}}]})
    res.send(ventaARetornar)
}
PresupuestoCTRL.entreFechasConCliente = async(req,res) => {
    const {idCliente,desde,hasta} = req.params;
    console.log(req.params)
    const VentaAretornar = await Presupuesto.find({$and:[{cliente:idCliente},{fecha:{$gte: new Date(desde)}},{fecha:{$lte: new Date(hasta)}}]})
    res.send(VentaAretornar);
};


PresupuestoCTRL.borrarPresupuesto = async(req,res) =>{
    const {id} = req.params;
    await Presupuesto.findOneAndDelete({nro_comp:id});
    res.send(`Presupuesto ${id} eliminado`)

}

module.exports = PresupuestoCTRL