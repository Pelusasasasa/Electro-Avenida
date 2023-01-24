const {Router} = require('express');
const router = Router();

const { post, getForCliente,getbetweenDates } = require('../controllers/recibo.controllers');

router.route('/')
    .post(post)
router.route('/forCliente/:codigo')
    .get(getForCliente)
router.route('/getbetweenDates/:desde/:hasta')
    .get(getbetweenDates)

module.exports = router