const { Router } = require('express');

const router = Router();

const { postOne, getForCodigo, putForCodigo, getAll } = require('../controllers/mercadoLibre.controllers');

router.route('/')
    .post(postOne)
    .get(getAll);
router.route('/forCodigo/:codigoML')
    .get(getForCodigo)
    .put(putForCodigo)

module.exports = router;