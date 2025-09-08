const tarjetaCTRL = {};

const Tarjeta = require('../models/Tarjeta');

tarjetaCTRL.post = async (req, res) => {

    try {
        const tarjeta = new Tarjeta(req.body);
        await tarjeta.save();
        
        res.send({
            ok: true,
            tarjeta
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            ok: false,
            msg: 'Hable Con el administrador'
        })
    }
}

tarjetaCTRL.getAll = async (req, res) => {
    const tarjetas = await Tarjeta.find();
    res.send(tarjetas);
};

tarjetaCTRL.getForId = async (req, res) => {
    const { id } = req.params;
    const tarjeta = (await Tarjeta.find({ _id: id }))[0];
    res.send(tarjeta);
}

tarjetaCTRL.putForId = async (req, res) => {
    const { id } = req.params;
    const tarjeta = (await Tarjeta.findOneAndUpdate({ _id: id }, req.body))
    res.send(tarjeta);
}

tarjetaCTRL.deleteId = async (req, res) => {
    const { id } = req.params;
    const tarjeta = await Tarjeta.findByIdAndDelete({ _id: id });
    console.log(`Tarjeta ${id} Eliminada`);
    res.send('Tarjeta Eliminada');
}

tarjetaCTRL.totalPrice = async (req, res) => {
    let total = 0;
    const tarjetas = await Tarjeta.find();
    for (let tarjeta of tarjetas) {
        total += tarjeta.imp;
    }
    res.send(total.toFixed(2));
}

module.exports = tarjetaCTRL;