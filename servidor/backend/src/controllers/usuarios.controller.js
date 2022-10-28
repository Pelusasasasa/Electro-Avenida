const usuariosCTRL = {};


const Usuarios = require('../models/usuarios')

usuariosCTRL.getUsuarios = async(req,res)=>{
    const usuarios = await Usuarios.find()
    res.json(usuarios)
}
usuariosCTRL.crearUsuario = async(req,res)=>{
    const nuevoUsuario = new Usuarios(req.body)
    await nuevoUsuario.save()
    console.log(`Usuario ${req.body.nombre} Creado`)
    res.json(`Usuario ${req.body.nombre} Creado`)
}

usuariosCTRL.getUsuario =async (req,res)=>{
    const {id} = req.params
    res.send(await Usuarios.findById(id))
}

usuariosCTRL.actualizarUsuario = async(req,res)=>{
    const {id} = req.params
    await Usuarios.findOneAndDelete({_id:id});
    const nuevoUsuario = new Usuarios(req.body);
    await nuevoUsuario.save();
    console.log(`Usuario ${req.body.nombre} Modificado`)
    res.send(`Usuario ${req.body.nombre} Modificado`)
}

usuariosCTRL.deleteUsuario = async (req,res)=>{
    const {id} = req.params;
    await Usuarios.findByIdAndDelete(id)
    res.send(`Usuario ${id} Eliminado`)
}


module.exports = usuariosCTRL