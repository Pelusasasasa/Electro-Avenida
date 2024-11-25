const mlCTRL = {};

const MercadoLibre = require('../models/MercadoLibre');

mlCTRL.getAll = async(req, res) => {
    const mercadoLibres = await MercadoLibre.find();

    res.send( mercadoLibres );
};

mlCTRL.getForCodigo = async(req, res) => {
    const { codigoML } = req.params;

    const mercadolibre = await MercadoLibre.findOne({codigoML: codigoML});

    res.send( mercadolibre );
};

mlCTRL.postOne = async(req, res) => {
    const mercadolibre = new MercadoLibre(req.body);

    await mercadolibre.save();

    res.send( mercadolibre );
};

mlCTRL.putForCodigo  = async(req, res) => {
    const { codigoML } = req.params;

    const mercadolibre = await MercadoLibre.findOneAndUpdate({codigoML: codigoML}, {$set: req.body}, {new: true});

    res.send( mercadolibre );
};

mlCTRL.deleteForCodigo =  async(req, res) => {
    const { codigoML } = req.params;

    const publicacion = MercadoLibre.findOneAndDelete({codigoML: codigoML});
};

module.exports = mlCTRL;