const { Router } = require('express');

const router = Router();

const { postOne, getForCodigo, putForCodigo, getAll, deleteForCodigo } = require('../controllers/mercadoLibre.controllers');

router.route('/')
    .post(postOne)
    .get(getAll);
router.route('/forCodigo/:codigoML')
    .get(getForCodigo)
    .put(putForCodigo)
    .delete(deleteForCodigo)

module.exports = router;