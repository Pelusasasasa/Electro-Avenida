const ventasCTRL = {}

const Ventas = require('../models/venta');

ventasCTRL.cargarVenta = async(req,res)=>{
    const now = new Date();
    req.body.fecha = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString();
    const id = (await Ventas.find().sort({$natural:-1}).limit(1))[0];
    req.body._id = id ? id._id + 1 : 1;
    const venta = new Ventas(req.body);
    venta.save()
    console.log(`Venta ${req.body.nro_comp} guardada por el vendedor ${req.body.vendedor} en la maquina ${req.body.maquina} con la hora ${(new Date()).toLocaleString()}`);
    res.send(venta)
};

ventasCTRL.eliminarVenta = async(req,res)=>{
    const {id} = req.params;
    const a = await Ventas.findOneAndDelete({nro_comp:id}); 
    console.log(`Venta ${id} Eliminada`);
    res.send(a);
};

ventasCTRL.entreFechas = async(req,res) => {
    const {desde,hasta} = req.params;
    const ventas = await Ventas.find({
        $and:
        [
            {fecha:{$gte: new Date(desde)}},
            {fecha:{$lte: new Date(hasta + "T23:59:59.000Z")}}
        ]
    });
    res.send(ventas)
};

ventasCTRL.entreFechasConId = async(req,res) => {
    const {id,desde,hasta} = req.params
    const ventaARetornar =  await Ventas.find(
        {$and:
            [
            {nro_comp:id},
            {fecha:{$gte: new Date(desde)}},
            {fecha:{$lte: new Date(hasta + "T23:59:59.00Z")}}
        ]})
    res.send(ventaARetornar)
};

ventasCTRL.entreFechasConCliente = async(req,res) => {
    const {idCliente,desde,hasta} = req.params
    const ventaARetornar =  await Ventas.find({$and:[{cliente:idCliente},{fecha:{$gte: new Date(desde)}},{fecha:{$lte: new Date(hasta)}}]})
    res.send(ventaARetornar)
};

ventasCTRL.modificarVentas = async(req,res) =>{
    const {id} = req.params;
    await Ventas.findByIdAndUpdate({_id:id},req.body)
    console.log(`Venta ${req.body.nro_comp} Modificada`)
    res.send("Venta Modificada")
};

ventasCTRL.getVentasForMonth = async(req,res)=>{
    const {month,year} = req.params;

    const ventas = await Ventas.find({
        $expr:{
            $and:[
                {$eq:[{$month:"$fecha"},Number(month)]},
                {$eq:[{$year:"$fecha"},Number(year)]}
            ]
        }
    });

    res.send(ventas);


};

ventasCTRL.traerTicket = async(req,res)=>{
    const {numero,tipo,condIva} = req.params;
    const venta = (await Ventas.findOne(
        {
            nro_comp:numero,
            tipo_comp:tipo,
            condIva:condIva
        }));
    res.send(venta)
};

ventasCTRL.traerVentas = async(req,res)=>{
    const {id} = req.params;
    const venta = await Ventas.find();
    res.send(venta)
};

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
    res.send(venta[0]);
};

module.exports = ventasCTRL;