const ventasCTRL = {}

const Ventas = require('../models/venta');

ventasCTRL.cargarVenta = async(req,res)=>{
    const now = new Date();
    req.body.fecha = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString();
    const id = (await Ventas.find().sort({$natural:-1}).limit(1))[0];
    req.body._id = id ? id._id + 1 : 1;
    const venta = new Ventas(req.body);
    venta.save()
    console.log(`Venta ${req.body.nro_comp} guardada a la hora ${req.body.fecha}`);
    res.send(venta)
}

ventasCTRL.traerVentas = async(req,res)=>{
    const {id} = req.params;
    const venta = await Ventas.find();
    res.send(venta)
}

ventasCTRL.traerVentaUnica = async(req,res)=>{
    const {numero,tipo} = req.params;
    let tipo_comp = "";
    let venta;
    if (tipo === "6" || tipo === "1") {
        tipo_comp = "Ticket Factura";
        venta = await Ventas.find({nro_comp:numero,tipo_comp:tipo_comp,cod_comp:tipo});
    }else if(tipo === "3" || tipo === "8"){
        tipo_comp = "Nota Credito";
        venta = await Ventas.find({nro_comp:numero,tipo_comp:tipo_comp,cod_comp:tipo});
    }else{
        venta = await Ventas.find({nro_comp:numero,tipo_comp:tipo});
    }
    console.log(venta)
    res.send(venta[0]);
}

ventasCTRL.modificarVentas = async(req,res) =>{
    const {id} = req.params;
    await Ventas.findByIdAndUpdate({_id:id},req.body)
    console.log(`Venta ${req.body.nro_comp} Modificada`)
    res.send("Venta Modificada")
}
ventasCTRL.entreFechas = async(req,res) => {
    const {desde,hasta} = req.params;
    const ventas = await Ventas.find({$and:[{fecha:{$gte: new Date(desde)}},{fecha:{$lte: new Date(hasta)}}]})
    res.send(ventas)
}
ventasCTRL.entreFechasConId = async(req,res) => {
    const {id,desde,hasta} = req.params
    const ventaARetornar =  await Ventas.find({$and:[{nro_comp:id},{fecha:{$gte: new Date(desde)}},{fecha:{$lte: new Date(hasta)}}]})
    res.send(ventaARetornar)
}

ventasCTRL.entreFechasConCliente = async(req,res) => {
    const {idCliente,desde,hasta} = req.params
    const ventaARetornar =  await Ventas.find({$and:[{cliente:idCliente},{fecha:{$gte: new Date(desde)}},{fecha:{$lte: new Date(hasta)}}]})
    res.send(ventaARetornar)
}

ventasCTRL.traerTicket = async(req,res)=>{
    const {numero,tipo,condIva} = req.params;
    const venta = (await Ventas.find({nro_comp:numero,tipo:tipo,condIva:condIva}))[0];
    res.send(venta)
}

ventasCTRL.eliminarVenta = async(req,res)=>{
    const {id} = req.params;
    const a = await Ventas.findOneAndDelete({nro_comp:id}); 
    console.log(`Venta ${id} Eliminada`);
    res.send(a);
}

module.exports = ventasCTRL;