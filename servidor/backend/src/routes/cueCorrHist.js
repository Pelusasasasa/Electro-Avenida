const {Router} = require('express');
const router = Router();

const {cargarHistorica,eliminarCuenta,traerHistoricaId,traerHistoricaCliente,modificarHistorica, traerHistoricaPorNumero, modificarHistoricaPorNumero} = require("../controllers/cueCorrHist.controllers");

router.route('/')
    .post(cargarHistorica)
router.route('/id/:id')
    .get(traerHistoricaId)
    .put(modificarHistorica)
    .delete(eliminarCuenta)
router.route('/cliente/:id')
    .get(traerHistoricaCliente)
router.route('/numero/:numero')
    .get(traerHistoricaPorNumero)
    .put(modificarHistoricaPorNumero)


module.exports = router