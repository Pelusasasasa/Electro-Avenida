const variacionCTRL = {};

const Variacion = require('../models/Variacion');

variacionCTRL.postMany = async(req, res) => {
    let variaciones = [];

    for (let elem of req.body){
        const variacion = new Variacion(elem);
        await variacion.save();
        variaciones.push(variacion);
    };

    res.send( JSON.stringify(variaciones) );
};

variacionCTRL.putMany = async(req, res) => {
    let variaciones = [];

    for(let elem of req.body){
        const variacion = await Variacion.findOneAndUpdate(elem);
        variaciones.push(variacion);
    };

    res.send( variaciones );
};

variacionCTRL.getForPublicacionId = async(req, res) => {
    const { publicacionId } = req.params;

    const publicaciones = await Variacion.find({publicacion: publicacionId})

    res.send(publicaciones);
};

module.exports = variacionCTRL;