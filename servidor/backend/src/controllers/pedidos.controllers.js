const pedidosCTRL = {}

const Pedidos = require("../models/pedido")

pedidosCTRL.traerPedidos = async(req,res)=>{
    const pedidos = await Pedidos.find()
    .populate('codigo', ['descripcion', 'marca', 'stock', 'provedor'])
    res.send(pedidos)
};

pedidosCTRL.crearPedido = async(req,res)=>{  
    const now = new Date();
    req.body.fecha = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString();

    try {
        const pedido = new Pedidos(req.body)
        const pedidoGuardado = await (await pedido.save()).populate('codigo', ['descripcion', 'marca', 'stock', 'provedor']);                        

        console.log(`Pedido ${req.body.codigo} Guardado por el vendedor ${pedido.vendedor} de la maquina ${req.body.maquina} con la fecha y hora ${new Date().toLocaleString()}`)
        res.send(pedidoGuardado)

    } catch (error) {
        console.error(error)
        res.status(500).json({
            ok: false,
            msg: 'Hable Con el Administrador'
        })
    }
};

pedidosCTRL.traerPedido = async(req,res)=>{
    const {id} = req.params;
    const pedido = await Pedidos.findOne({_id:id}).populate('codigo', ['descripcion, marca, stock, provedor']);
    res.send(pedido);
};

pedidosCTRL.modificarPedido = async(req,res)=>{
    const {id} = req.params;
    const {vendedorQueModifico,maquina} = req.body;
    await Pedidos.findByIdAndUpdate({_id:id},req.body)
    console.log(`Pedido ${req.body.producto} modificado por el vendedor ${vendedorQueModifico} de la maquina ${maquina} con la fecha y hora ${new Date().toLocaleString()}`);
    res.send("guardado")
};

pedidosCTRL.eliminarPedido = async(req,res)=>{
    const {id} = req.params;
    const {vendedor,maquina,pedido} = req.body;
    await Pedidos.findByIdAndDelete({_id:id})
    console.log(`Pedido ${pedido} Eliminado por el vendedor ${vendedor} de la maquina ${maquina} con la fecha y hora ${new Date().toLocaleString()}`);
    res.send("eliminado");
};

module.exports = pedidosCTRL 