const {Router} = require("express")
const router = Router();


const {traerVentas,crearTipoVenta,modificarTipoVenta} = require("../controllers/tipoVenta.controllers")

router.route('/')
    .get(traerVentas)
    .post(crearTipoVenta)
    .put(modificarTipoVenta)
module.exports = router