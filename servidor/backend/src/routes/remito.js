const {Router} = require('express')
const router = Router();

const {postRemito,getAllRemitos, getBeetweenDates, getForNumber} = require('../controllers/remito.controllers');

router.route('/')
    .post(postRemito)
    .get(getAllRemitos)
router.route('/forNumber/:numero')
    .get(getForNumber)
router.route('/betweenDates/:desde/:hasta')
    .get(getBeetweenDates)
module.exports = router;