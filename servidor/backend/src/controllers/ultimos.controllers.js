const ultimosCTRL = {};

const Ultimos = require('../models/Ultimos.models');


ultimosCTRL.post = async(req,res)=>{
    const ultimo = new Ultimos(req.body);
    await ultimo.save();
    console.log("Ultimos Cargados");
    res.end();
}

ultimosCTRL.get = async(req,res)=>{
    const ultimo = (await Ultimos.find())[0];
    res.send(ultimo)
};

ultimosCTRL.put = async(req,res)=>{
    (await Ultimos.findOneAndUpdate({_id:req.body._id},req.body));
    res.send("Ultimos modificados");
};

ultimosCTRL.getLast = async(req, res) => {
    try {
        const ultimo = await Ultimos.findOne().sort({ _id: -1 });

        res.status(200).send({
            ok: true,
            ultimo
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
    
}

module.exports = ultimosCTRL;