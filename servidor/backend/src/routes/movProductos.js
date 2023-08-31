const {Router} = require("express");
const router = Router();

const {cargarMovimientoProducto,modificarVarios,traerMovProducto,traerMoviemientoPorNumeroYTipo,
        modificarMovimiento, getsForRubro,traerMoviemientoPorNumeroTipoYCliente} =
     require("../controllers/movProductos.controllers");

router.route('/')
    .post(cargarMovimientoProducto)
    .put(modificarVarios)

router.route('/:id')
    .get(traerMovProducto)
    .put(modificarMovimiento)

router.route('/:numero/:tipo')
    .get(traerMoviemientoPorNumeroYTipo)

router.route('/movimientosPorCliente/:numero/:tipo/:cliente')
    .get(traerMoviemientoPorNumeroTipoYCliente)

router.route('/:desde/:hasta/:rubro')
    .get(getsForRubro)

module.exports = router