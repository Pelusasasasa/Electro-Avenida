const pedidosCTRL = {}

const Pedidos = require("../models/pedido")

pedidosCTRL.traerPedidos = async(req,res)=>{
    const pedidos = await Pedidos.find()
    res.send(pedidos)
}

pedidosCTRL.crearPedido = async(req,res)=>{  
    const now = new Date();
    req.body.fecha = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString();
    const pedido = new Pedidos(req.body)
    pedido.save()
    console.log(`Pedido ${req.body.producto} Guardado por el vendedor ${pedido.vendedor} de la maquina ${req.body.maquina} con la fecha y hora ${new Date().toLocaleString()}`)
    res.send("Pedido Guardado")
}

pedidosCTRL.traerPedido = async(req,res)=>{
    const {id} = req.params;
    const pedido = await Pedidos.findOne({_id:id});
    res.send(pedido);
}

pedidosCTRL.modificarPedido = async(req,res)=>{
    const {id} = req.params;
    const {vendedorQueModifico,maquina} = req.body;
    await Pedidos.findByIdAndUpdate({_id:id},req.body)
    console.log(`Pedido ${req.body.producto} modificado por el vendedor ${vendedorQueModifico} de la maquina ${maquina} con la fecha y hora ${new Date().toLocaleString()}`);
    res.send("guardado")
}

pedidosCTRL.eliminarPedido = async(req,res)=>{
    const {id} = req.params;
    const {vendedor,maquina,pedido} = req.body;
    await Pedidos.findByIdAndDelete({_id:id})
    console.log(`Pedido ${pedido} Eliminado por el vendedor ${vendedor} de la maquina ${maquina} con la fecha y hora ${new Date().toLocaleString()}`);
    res.send("eliminado");
}

module.exports = pedidosCTRL 