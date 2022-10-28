const {Router} = require('express')
const { getUsuarios, getUsuario,crearUsuario,deleteUsuario,actualizarUsuario } = require('../controllers/usuarios.controller')
const router = Router() 

router.route('/')
    .get(getUsuarios)
    .post(crearUsuario)

router.route('/:id')
     .get(getUsuario)
     .put(actualizarUsuario)
     .delete(deleteUsuario)


module.exports = router;