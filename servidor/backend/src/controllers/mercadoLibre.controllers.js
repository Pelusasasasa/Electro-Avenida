const mlCTRL = {};

const MercadoLibre = require('../models/MercadoLibre');

mlCTRL.getRefreshToken = async (req, res) => {
    const refreshToken = await MercadoLibre.findOne();
    res.json(refreshToken.refreshToken);
};

mlCTRL.getAutherizacion = async(req, res) => {
    const autherizacion = await MercadoLibre.findOne();
    res.send( autherizacion );
};

mlCTRL.putAutherizacion = async(req, res) => {
    console.log(req.body)
    const autherizacion = await MercadoLibre.findOneAndUpdate({$set:{autherizacion: req.body.res}});
    res.send( autherizacion );
};

module.exports = mlCTRL;