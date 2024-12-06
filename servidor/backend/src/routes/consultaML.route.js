const { Router } = require('express');
const router = Router();

const { traerConsultas, traerConsulta, responderConsulta } = require('../controllers/consultaML.controllers');

router.route('/consultas')
    .get(traerConsultas)
router.route('/forId/:id')
    .get(traerConsulta)
    .post(responderConsulta)

module.exports = router