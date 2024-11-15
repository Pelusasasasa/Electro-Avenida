const tipoVentaCTLR = {};

const TipoVenta = require("../models/tipoVenta")


tipoVentaCTLR.traerVentas = async(req,res)=>{
    const tipoVenta = await TipoVenta.find();
    res.send(tipoVenta[0])
}

tipoVentaCTLR.crearTipoVenta = async(req,res)=>{
    const tipoventa = new TipoVenta(req.body);
    await tipoventa.save()
    res.send("Tipo Venta creado");
}

tipoVentaCTLR.modificarTipoVenta = async(req,res)=>{
    await TipoVenta.findOneAndUpdate(req.body)
    res.send("Numeros Modificados");
}

tipoVentaCTLR.getForName = async(req,res)=>{
    const {name} = req.params;
    const numero = await TipoVenta.findOne()
    res.send(`${numero[name]}`);
}

tipoVentaCTLR.putForName = async(req,res)=>{
    const {name} = req.params;
    const numeros = await TipoVenta.findOne();
    numeros[name] = req.body.valor;
    await TipoVenta.findOneAndUpdate({_id:numeros._id},numeros);
    res.send(numeros);
}
module.exports = tipoVentaCTLR