const {Router} = require('express');
const router = Router();

const { actualizarcodigoML, postOne, getCodigoML, verificarAuthorizacion } = require('../controllers/codigoML.controllers');

router.route('/')
    .get(getCodigoML)
    .post(postOne)
    .put(actualizarcodigoML)
router.route('/verificarAuthorizacion')
    .get(verificarAuthorizacion)

module.exports = router;