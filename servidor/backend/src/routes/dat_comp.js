const {Router} = require('express');
const router = Router();

const {post, getBetween, getForId, putForId, getFechaImpt, getForNumeroComp} = require('../controllers/dat_comp.controllers');

router.route('/')
    .post(post)
router.route('/id/:id')
    .get(getForId)
    .put(putForId)
    .delete(deleteForId)
router.route('/between/:desde/:hasta')
    .get(getBetween)
router.route('/fechaImp/:desde/:hasta')
    .get(getFechaImpt)
router.route('/nro_comp/:numero')
    .get(getForNumeroComp)
module.exports = router;