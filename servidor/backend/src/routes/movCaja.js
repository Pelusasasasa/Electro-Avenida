const {Router} = require('express');
const router = Router();

const {post, getAll, getBetweenDates, put, getForDateAndCuenta, getPriceBetweenDates} = require('../controllers/movCaja.controllers');

router.route('/')
    .post(post)
    .get(getAll)
    .put(put)
router.route('/price/:desde/:hasta')
    .get(getPriceBetweenDates)
router.route('/:desde/:hasta/:idCuenta')
    .get(getForDateAndCuenta)
router.route('/:desde/:hasta')
    .get(getBetweenDates)


module.exports = router