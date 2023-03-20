const {Router} = require('express');
const router = Router();

const { post, getForCliente,getbetweenDates, getForNro_comp } = require('../controllers/recibo.controllers');

router.route('/')
    .post(post)
router.route('/forCliente/:codigo')
    .get(getForCliente)
router.route('/getbetweenDates/:desde/:hasta')
    .get(getbetweenDates)
router.route('/forNro_comp/:numero')
    .get(getForNro_comp)
module.exports = router