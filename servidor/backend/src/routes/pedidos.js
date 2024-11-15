const {Router} = require("express");
const router = Router()
const {traerPedidos,crearPedido,eliminarPedido,modificarPedido, traerPedido} = require("../controllers/pedidos.controllers")

router.route('/')
    .get(traerPedidos)
    .post(crearPedido)

router.route('/:id')
    .get(traerPedido)
    .put(modificarPedido)
    .delete(eliminarPedido)

module.exports = router