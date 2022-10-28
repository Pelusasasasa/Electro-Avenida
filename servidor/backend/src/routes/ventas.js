const {Router} = require("express");
const { get } = require("express/lib/response");
const router = Router();

const {cargarVenta,traerVentas,modificarVentas,entreFechas,entreFechasConId,eliminarVenta,traerTicket,entreFechasConCliente,traerVentaUnica} = require("../controllers/ventas.controllers")

router.route('/')
    .post(cargarVenta)

router.route('/:id')
    .get(traerVentas)
    .put(modificarVentas)
    .delete(eliminarVenta)

router.route('/:desde/:hasta')
    .get(entreFechas)

router.route('/factura/:numero/:tipo/:condIva')
    .get(traerTicket)

router.route('/:id/:desde/:hasta')
    .get(entreFechasConId)

router.route('/cliente/:idCliente/:desde/:hasta')
    .get(entreFechasConCliente)

router.route('/venta/ventaUnica/:numero/:tipo')
    .get(traerVentaUnica)

module.exports = router