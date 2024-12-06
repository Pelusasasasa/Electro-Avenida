const codigoMLCTRL = {};

const CodigoML = require('../models/CodigoML');

codigoMLCTRL.actualizarcodigoML = async(req, res) => {
    try {
        const updateData = req.body;
        const codigo = await CodigoML.findOneAndUpdate({}, updateData, {new: true});

        if (!codigo){
            return res.status(404).send({msg: 'No se encontro ningun codigo para actualizar'})
        };

        res.status(200).send(codigo);
    } catch (error) {
        res.status(500).send({error: error.message})
    };
};

codigoMLCTRL.getCodigoML = async(req, res) => {
    try {
        const codigo = (await CodigoML.findOne());

    if (!codigo){
        res.status(404).send({msg: 'No se encontro ningun codigo'})
    }

        res.status(200).send(codigo)
    } catch (error) {
        res.status(500).send({error: error.message})    
    }
};

codigoMLCTRL.postOne = async(req, res) => {

    try {
        const postdata = req.body;

        const codigo = new CodigoML(postdata);
        await codigo.save();

        if (!codigo){
            return res.status(404).send({msg: 'No se pudo cargar el codigo'});
        };

        res.status(200).send(codigo);

    } catch (error) {
        res.status(500).send({error: error.message})
    }


};

module.exports = codigoMLCTRL;