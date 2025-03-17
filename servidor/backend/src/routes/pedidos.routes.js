const { Router } = require("express");
const router = Router()
const { traerPedidos, crearPedido, eliminarPedido, modificarPedido, traerPedido, putPedido } = require("../controllers/pedidos.controllers")

router.route('/')
    .get(traerPedidos)
    .post(crearPedido)

router.route('/:id')
    .get(traerPedido)
    .put(modificarPedido)
    .delete(eliminarPedido)

router.route('/forId/:id')
    .patch(putPedido)

module.exports = router;    