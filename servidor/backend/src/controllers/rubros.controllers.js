const rubrosCTRL = {};

const Rubro = require('../models/Rubro');

rubrosCTRL.post = async(req,res)=>{
    const rubro = new Rubro(req.body);
    await rubro.save();
    res.send(`Rubro ${req.body.nombre} Cargado`)
}

rubrosCTRL.getsAll = async(req,res)=>{
    const rubros = await Rubro.find();
    res.send(rubros);
}

rubrosCTRL.getsLastCodigo = async(req,res)=>{
    const lastRubro = (await Rubro.find({}).sort({$natural:-1}).limit(1))[0]
    const codigo = lastRubro ? lastRubro.codigo + 1 : 1;
    res.send(`${codigo}`)
}

rubrosCTRL.deleteOne = async(req,res)=>{
    const {id} = req.params;
    const rubro = await Rubro.findOneAndDelete({_id:id});
    console.log(`rubro con el id: ${id} Eliminado`);
    res.send(`rubro con el id: ${id} Eliminado`);
}

module.exports = rubrosCTRL