const {Router} = require('express');
const router = Router();

const {post, getAll, getBetweenDates, put, getForDateAndCuenta} = require('../controllers/movCaja.controllers');

router.route('/')
    .post(post)
    .get(getAll)
    .put(put)
router.route('/:desde/:hasta/:idCuenta')
    .get(getForDateAndCuenta)
router.route('/:desde/:hasta')
    .get(getBetweenDates)

module.exports = router