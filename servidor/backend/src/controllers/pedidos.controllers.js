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
    console.log(`Pedido ${req.body.producto} Guardado a la hora ${req.body.fecha}`)
    res.send("Pedido Guardado")
}

pedidosCTRL.modificarPedido = async(req,res)=>{
    const {id} = req.params;
    await Pedidos.findByIdAndUpdate({_id:id},req.body)
    console.log(`Pedido ${req.body.producto} modificado`)
    res.send("guardado")
}

pedidosCTRL.eliminarPedido = async(req,res)=>{
    const {id} = req.params
    await Pedidos.findByIdAndDelete({_id:id})
    console.log(`Pedido ${id} Eliminado`)
    res.send("eliminado")
}

module.exports = pedidosCTRL 