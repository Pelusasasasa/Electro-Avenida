const {Router} = require("express")
const router = Router()

const {traerClientes,crearCliente,traerClienteConSaldo,tamanioArreglo,traerCliente,modificarCliente,eliminarCliente,traerClientePorCuit,traerClientesConSaldos} = require('../controllers/clientes.controllers')


router.route('/')
    .get(traerClientesConSaldos)
    .post(crearCliente)
    
router.route('/:identificador')
    .get(traerClientes)
    .put(modificarCliente)
    .delete(eliminarCliente)

router.route('/id/:id')
    .get(traerCliente)

router.route('/cuit/:cuit')
    .get(traerClientePorCuit)

    //se usa para saber el tamaño del codigo de cliente
router.route('/crearCliente/:inicial')
    .get(tamanioArreglo)

router.route('/clienteConSaldo/:id')
    .get(traerClienteConSaldo)

    module.exports = router;