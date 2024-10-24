const { Router } = require('express');
const router = Router();

const { getRefreshToken } = require('../controllers/mercadoLibre.controllers');

router.route('/refreshToken')
    .get(getRefreshToken)

module.exports = router;