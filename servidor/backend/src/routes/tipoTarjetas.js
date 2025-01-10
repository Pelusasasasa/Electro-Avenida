const {Router} = require('express');
const router = Router();

const {post,getsAll, deleteByName} = require('../controllers/tipoTarjeta.controllers');

router.route('/')
    .post(post)
    .get(getsAll)
router.route('/:nombre')
    .delete(deleteByName)

module.exports = router;