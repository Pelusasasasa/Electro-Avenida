const {Router} = require('express');
const router = Router();

const {post, getForCodProv, getForNumber} = require('../controllers/com_pago.controllers');


router.route('/')
    .post(post)
router.route('/forCodProv/:codigo')
    .get(getForCodProv)
router.route('/forNumber/:number')
    .get(getForNumber)

module.exports = router;