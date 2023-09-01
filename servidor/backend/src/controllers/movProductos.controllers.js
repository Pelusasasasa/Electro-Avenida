const movProductosCTRL = {}

const movProducto = require("../models/movProducto");

movProductosCTRL.traerMovProducto = async(req,res)=>{
    const {id} = req.params;
    const movimientos = await movProducto.find({codProd: id})
    res.send(movimientos)
}

movProductosCTRL.modificarVarios = async(req,res)=>{
    const arreglo = req.body;
    for await(let movimiento of arreglo){
        await movProducto.findOneAndUpdate({_id:movimiento._id},movimiento);
        console.log(`Moviemiento con el id: ${movimiento._id} --- ${movimiento.descripcion} Modificado`)
    }
    res.send("Movimientos modificados")
}


movProductosCTRL.cargarMovimientoProducto = async(req,res)=>{
    let ultimoMovimiento = await movProducto.find().sort({$natural:-1}).limit(1)
    let id =  ultimoMovimiento[0] ? ultimoMovimiento[0]._id : 0;
    const arreglo = req.body;
    console.log("El id inicial es : " + id)
    for await(let movimiento of arreglo){
        const now = new Date();
        movimiento.fecha = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString();
        movimiento._id = id + 1;
        id = id + 1;
        const nuevoMovimiento = new movProducto(movimiento);
        await nuevoMovimiento.save();
        console.log(`Movimiento del producto ${movimiento.descripcion} Cargado por el vendedor ${movimiento.vendedor} de la maquina ${movimiento.maquina} con la fecha y hora ${(new Date()).toLocaleString()}`);
    }
    res.send("movimientos guardado");
}


movProductosCTRL.traerMoviemientoPorNumeroYTipo = async(req,res)=>{
    const {numero,tipo} = req.params;
    const movimientos = await movProducto.find({nro_comp:numero,tipo_comp:tipo});
    res.send(movimientos);
};

movProductosCTRL.traerMoviemientoPorNumeroTipoYCliente = async(req,res)=>{
    const {numero,tipo,cliente} = req.params;
    const movimientos = await movProducto.find({nro_comp:numero,tipo_comp:tipo,codCliente:cliente});
    console.log(movimientos)
    res.send(movimientos);

};

movProductosCTRL.modificarMovimiento = async(req,res)=>{
    const {id} = req.params;
    delete req.body._id;
    await movProducto.findOneAndUpdate({_id:id},req.body);
    console.log(`Movimiento ${id} Modificado`)
    res.send(`Movimiento ${id} Modificado`);
}

movProductosCTRL.getsForRubro = async(req,res)=>{
    const {rubro,desde,hasta} = req.params;
    const diaSiguiente = new Date(hasta.slice(0,15));
    const movimientos = await movProducto.find({$and:[
        {rubro:rubro},
        {fecha:{$gte:desde}},
        {fecha:{$lte:diaSiguiente}}
    ]});
    res.send(movimientos)
}

module.exports = movProductosCTRL