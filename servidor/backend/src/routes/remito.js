const {Router} = require('express')
const router = Router();

const {postRemito,getAllRemitos, getBeetweenDates} = require('../controllers/remito.controllers');

router.route('/')
    .post(postRemito)
    .get(getAllRemitos)
router.route('/betweenDates/:desde/:hasta')
    .get(getBeetweenDates)
module.exports = router;