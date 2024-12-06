const {Router} = require('express');
const router = Router();

const { actualizarcodigoML, postOne, getCodigoML } = require('../controllers/codigoML.controllers');

router.route('/')
    .get(getCodigoML)
    .post(postOne)
    .put(actualizarcodigoML)

module.exports = router;