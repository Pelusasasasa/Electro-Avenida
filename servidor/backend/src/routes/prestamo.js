const {Router} =require('express');
const router = Router();

const { post, getBetweenDate, getForNumber, putForNumber, getAnuladosBetweenDate, anularVarios } = require('../controllers/prestamo.controllers');

router.route('/')
    .post(post)
router.route('/anularVarios/:numero')
    .put(anularVarios)
router.route('/forNumber/:numero')
    .get(getForNumber)
    .put(putForNumber)
router.route('/betweenDates/:desde/:hasta')
    .get(getBetweenDate)
router.route('/anulados/:desde/:hasta')
    .get(getAnuladosBetweenDate)
module.exports = router;