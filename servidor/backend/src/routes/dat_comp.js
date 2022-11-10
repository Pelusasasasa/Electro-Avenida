const {Router} = require('express');
const router = Router();

const {post, getBetween, getForId, putForId} = require('../controllers/dat_comp.controllers');

router.route('/')
    .post(post)
router.route('/id/:id')
    .get(getForId)
    .put(putForId)
router.route('/between/:desde/:hasta')
    .get(getBetween)

module.exports = router;