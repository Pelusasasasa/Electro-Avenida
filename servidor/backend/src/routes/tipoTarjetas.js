const {Router} = require('express');
const router = Router();

const {post,getsAll} = require('../controllers/tipoTarjeta.controllers');

router.route('/')
    .post(post)
    .get(getsAll)

module.exports = router;