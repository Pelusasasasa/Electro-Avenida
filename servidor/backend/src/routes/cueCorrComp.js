const {Router} = require("express");
const router = Router();

const {cargarCompensada,modificarCompensada,borrarCompensada,modificarPorNumeroYCliente,traerCompensadasPorCliente,traerCompensada, traerCompensadasPorNumero, modificarCompensadaPorNumero, getPorNumeroYCliente} = require("../controllers/cueCorrComp.controllers");

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
router.route('/numeroYCliente/:numero/:cliente')
    .get(getPorNumeroYCliente)
    .put(modificarPorNumeroYCliente)
module.exports = router