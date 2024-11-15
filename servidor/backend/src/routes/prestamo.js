const {Router} =require('express');
const router = Router();

const { post, getForNumber, putForNumber, getAnuladosBetweenDate, anularVarios, get, getNoAnulados } = require('../controllers/prestamo.controllers');

router.route('/')
    .post(post)
    .get(get)
router.route('/anularVarios/:numero')
    .put(anularVarios)
router.route('/forNumber/:numero')
    .get(getForNumber)
    .put(putForNumber)
router.route('/noAnulados')
    .get(getNoAnulados)
router.route('/anulados/:desde/:hasta')
    .get(getAnuladosBetweenDate)
module.exports = router;