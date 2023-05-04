const {Router} =require('express');
const router = Router();

const { post, getBetweenDate, getForNumber, putForNumber } = require('../controllers/prestamo.controllers');

router.route('/')
    .post(post)
router.route('/forNumber/:numero')
    .get(getForNumber)
    .put(putForNumber)
router.route('/betweenDates/:desde/:hasta')
    .get(getBetweenDate)
module.exports = router;