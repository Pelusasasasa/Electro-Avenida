const codigoMLCTRL = {};

const { default: axios } = require('axios');
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

codigoMLCTRL.verificarAuthorizacion = async(req, res) => {
    const codigo = (await CodigoML.findOne());

    try {
        const user = (await axios.get(`https://api.mercadolibre.com/users/me`, {
            headers: {
                Authorization: `Bearer ${codigo.authorizacion}`
            }
        })).data;
        res.send(user)
    } catch (error) {

        const {access_token} = (await axios.post(`${codigo.url}oauth/token`,{
            grant_type:'refresh_token',
            client_id: '8351426981367452',
            code: 'TG-670e5faf324be700011ea691-231090073',
            refresh_token: 'TG-670e60957e88f500012c13e8-231090073',
            redirect_uri: 'https://www.electro-avenida.com.ar/',
            client_secret: 'n03VlrPoBnTyRmGDtDusOQwuu7qaNpHv',
        })).data;

        const updateData = {
            authorizacion: access_token
        };
        const retorno = await CodigoML.findOneAndUpdate({}, updateData, {new: true});

        res.status(202).send(retorno)

    };
};

module.exports = codigoMLCTRL;