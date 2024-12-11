const axios = require('axios');

const consultasCTRL = {};
const codigoML = require('../models/CodigoML');


consultasCTRL.responderConsulta = async(req, res) => {
    const {authorizacion, seller_id, url} = await codigoML.findOne();
    const { id }  = req.params;
    const text = req.body;

    try {
        const consulta = (await axios.post(`${url}/answers`,{
            headers:{
                Authorization: `Bearer ${authorizacion}`
            },
        },
        {
            "question_id": id,
            text
        })).data;
        res.status(201).send(consulta);
    } catch (error) {
        res.status(500).send({error: error.message});
    }
};

consultasCTRL.traerConsulta = async(req, res) => {
    const {authorizacion, seller_id, url} = await codigoML.findOne();
    const { id }  = req.params;

    try{
        const consulta = (await axios.get(`${url}/questions/${id}`,{
            headers:{
                Authorization: `Bearer ${authorizacion}`
            }
        })).data;
        res.send(consulta)
    } catch(error) {
        res.status(500).send({error: error.message});
    }
};

consultasCTRL.traerConsultas = async(req, res) => {
    const {authorizacion, seller_id, url} = await codigoML.findOne();
    try {
        const consultas = (await axios.get(`${url}/questions/search?api_version=4&seller_id=${seller_id}`, {
            headers:{
                Authorization: `Bearer ${authorizacion}`
            }
        })).data;   
        res.send(consultas)
    } catch (error) {
        res.status(500).send({error: error.message})
    }
};


module.exports = consultasCTRL;