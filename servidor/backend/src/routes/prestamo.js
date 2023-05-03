const {Router} =require('express');
const router = Router();

const { post, getBetweenDate } = require('../controllers/prestamo.controllers');

router.route('/')
    .post(post)
router.route('/betweenDates/:desde/:hasta')
    .get(getBetweenDate)
module.exports = router;