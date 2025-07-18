const productosCTRL = {};
const path = require('path');
const fs = require('fs');

const Productos = require("../models/Producto");

productosCTRL.buscarProducto = async(req, res) => {
    const { text } = req.params;
    try {
        let productos = [];

        if(text === 'textoVacio'){
            productos = await Productos.find().limit(50)
        }else{
            productos = await Productos.find({
                $or: [
                    {descripcion: new RegExp(text, 'i')},
                    {_id: new RegExp(text, 'i')},
                    {cod_fabrica: new RegExp(text, 'i')},
                    {marca: new RegExp(text, 'i')},
                ]
            });
        }


        res.status(200).json({
            ok: true,
            productos
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'No se pudo obtener los prodcutos'
        })
    }
};

productosCTRL.traerProductos = async(req,res)=>{
    let {texto,tipoBusqueda} = req.params;
    texto = texto.replace('ALT47','/');
    if(texto[0] === "*"){
            const contenga = texto.substr(1);
            const re = new RegExp(`${contenga}`)
            productos = await Productos.find({[tipoBusqueda]: {$regex: re, $options: 'i'}}).sort({descripcion: 1});
    }else if(texto !== "textoVacio"){
            let re   
            try {
                re = new RegExp(`^${texto}`);
               } catch (error) {
                re = "a" 
               }
            if (tipoBusqueda === "marca") {
                productos = await Productos.find({[tipoBusqueda]: {$regex: re,$options:'i'}}).sort({descripcion: 1})
            }else{
                productos = await Productos.find({[tipoBusqueda]: {$regex: re,$options:'i'}}).sort({descripcion: 1});
            }
    }else if(tipoBusqueda === "dolar"){
            productos = await Productos.find({costodolar: {$ne: 0}});
    }else{
            productos = await Productos.find().sort({descripcion: 1}).limit(50);

    }
    res.send(productos)
};

productosCTRL.getproducto = async(req,res)=>{
    const {id} = req.params
    let producto;
    if(id === "stockNegativo"){
        productos = await Productos.find({stock:{$lt: 0}})
        res.send(productos)
    }else{
        producto = await Productos.find({ _id: id });
        res.send(producto[0])
    }

};

productosCTRL.crearProducto = async(req,res)=>{
    const productonuevo = new Productos(req.body);
    await productonuevo.save();
    console.log(`Producto ${req.body.descripcion} Creado por el vendedor ${req.body.vendedor} en la maquina ${req.body.maquina} con la fecha y hora ${(new Date()).toLocaleString()}`);
    res.send("Producto Cargado");
};

productosCTRL.modificarProducto = async(req,res)=>{
    const {id} = req.params;
    const {vendedor,maquina} = req.body;
    const productoModificado = await Productos.findByIdAndUpdate({_id:id},req.body);
    console.log(`Producto ${req.body.descripcion} modificado por el vendedor ${vendedor} de la maquina ${maquina} con la fecha y hora ${(new Date()).toLocaleString()}`);
    res.send("Producto Modificado")
}

productosCTRL.modificarProductos = async(req,res)=>{
    const arreglo = req.body;
    for await(let producto of arreglo){
        await Productos.findByIdAndUpdate({_id:producto._id},producto);
        console.log(`Stock de ${producto.descripcion} es: ${producto.stock}`)
    }
    res.send("producto Modificado")
}

productosCTRL.borrarProducto = async(req,res)=>{
    const {id} = req.params;
    const {vendedor,maquina,producto} = req.body;
    await Productos.findByIdAndDelete({_id:id});
    console.log(`Producto ${producto} borrado por el vendedor ${vendedor} de la maquina ${maquina} con la fecha y hora ${(new Date()).toLocaleString()}`);
    res.send("Producto Borrado");
}

productosCTRL.traerProductosPorRango = async(req,res)=>{
    const {desde,hasta} = req.params;
    const productos = await Productos.find({$and: [{_id:{$gte: desde}},{_id:{$lte: hasta}}]});
    res.send(productos);
}

productosCTRL.traerMarcas = async(req,res)=>{
    const productos = await Productos.find({},{_id:0 , marca:1})
    let marcas = []
    productos.filter((ele)=>{
        if(!marcas.includes(ele.marca)){
            marcas.push(ele.marca)
        }
    })
    res.send(marcas)
};

productosCTRL.getProvedores = async(req,res)=>{
    const productos = await Productos.find({},{_id:0 , provedor:1});
    let provedores = [];
    productos.filter((ele)=>{
        if(!provedores.includes(ele.provedor)){
            provedores.push(ele.provedor);
        };
    });
    res.send(provedores);
};

productosCTRL.productosPorMarca = async(req,res)=>{
    const {marca} = req.params;
    const productos = await Productos.find({marca:marca});
    res.send(productos)
};

productosCTRL.productosPorProvedor = async(req,res)=>{
    const {provedor} = req.params;
    const productos = await Productos.find({provedor});
    res.send(productos)
};

productosCTRL.subirImagen = async(req,res)=>{
    const file = req.file;
    const {id} = req.params;
    const producto = (await Productos.find({_id:id}))[0];
    producto.imgURL = req.file.path;
    await Productos.findOneAndUpdate({_id:id},producto);
    res.send("Imagen subida")
};

productosCTRL.mostrarImagen = async(req,res)=>{
    const {id} = req.params;
    const direccion = path.join(__dirname,'../../') + `imagenes/` + id + ".jpg";
    const imagenGenerica = path.join(__dirname,'../../') + "imagenes/Generica.jpg";
    fs.access(direccion,fs.constants.F_OK,err=>{
        if (err) {
            res.sendFile(imagenGenerica);
        }else{
            res.sendFile(direccion);
        }
    });
};

productosCTRL.getStockCero = async(req,res)=>{
    const productos = await Productos.find({stock:"0"});
    res.send(productos)
};

productosCTRL.putStockCero = async(req,res)=>{
    const id = req.body._id;
    const producto = await Productos.findByIdAndUpdate({_id:id},req.body,{new:true});
    res.send(producto);
};



module.exports = productosCTRL;