const {Router} = require("express")
const router = Router();


const {traerVentas,crearTipoVenta,modificarTipoVenta, getForName, putForName} = require("../controllers/tipoVenta.controllers")

router.route('/')
    .get(traerVentas)
    .post(crearTipoVenta)
    .put(modificarTipoVenta)
router.route('/name/:name')
    .get(getForName)
    .put(putForName)
    
module.exports = router