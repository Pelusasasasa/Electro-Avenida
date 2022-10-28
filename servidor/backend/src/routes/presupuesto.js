const {Router} = require("express");
const router = Router();

const {cargarPresupuesto,traerPresupuesto,modificarPresupuesto,entreFechas,entreFechasConId,entreFechasConCliente, borrarPresupuesto} = require('../controllers/presupuesto.controllers')

router.route('/')
    .post(cargarPresupuesto)

router.route('/:id')
    .get(traerPresupuesto)
    .put(modificarPresupuesto)
    .delete(borrarPresupuesto)
router.route('/:desde/:hasta')
    .get(entreFechas)

router.route('/:id/:desde/:hasta')
    .get(entreFechasConId)    

router.route('/cliente/:idCliente/:desde/:hasta')
    .get(entreFechasConCliente)


module.exports = router