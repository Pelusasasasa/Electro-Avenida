const { Router } = require("express");
const router = Router();

const {traerCancelados,CargarCancelado,traerTamanio,traerEntreFechas} = require("../controllers/cancelados.controllers")

router.route('/')
    .get(traerCancelados)
    .post(CargarCancelado)

router.route('/tamanio/')
    .get(traerTamanio)

router.route('/:desde/:hasta/')
    .get(traerEntreFechas)

module.exports = router