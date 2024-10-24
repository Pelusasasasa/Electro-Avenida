const mlCTRL = {};

const MercadoLibre = require('../models/MercadoLibre');

mlCTRL.getRefreshToken = async (req, res) => {
    const refreshToken = await MercadoLibre.findOne();
    res.json(refreshToken.refreshToken);
};

module.exports = mlCTRL;