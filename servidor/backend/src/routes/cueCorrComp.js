const {Router} = require("express");
const router = Router();

const {cargarCompensada,modificarCompensada,borrarCompensada,traerCompensadasPorCliente,traerCompensada, traerCompensadasPorNumero, modificarCompensadaPorNumero} = require("../controllers/cueCorrComp.controllers");

router.route('/')
    .post(cargarCompensada)
router.route('/id/:id')
    .get(traerCompensada)
    .put(modificarCompensada)
    .delete(borrarCompensada)
router.route('/cliente/:codigo')
    .get(traerCompensadasPorCliente)
router.route('/numero/:numero')
    .get(traerCompensadasPorNumero)
    .put(modificarCompensadaPorNumero)

module.exports = router