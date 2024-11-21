const { Router } = require('express');
const router = Router();

const { getRefreshToken, getAutherizacion, putAutherizacion } = require('../controllers/mercadoLibre.controllers');

router.route('/refreshToken')
    .get(getRefreshToken)
router.route('/autherizacion')
    .get(getAutherizacion)
    .put(putAutherizacion)

module.exports = router;