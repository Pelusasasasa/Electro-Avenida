const {Router} = require('express');
const router = Router();

const {post,getAll,getForId, putForId} = require('../controllers/difCaja.controllers');

router.route('/')
    .get(getAll)
    .post(post)
router.route('/id/:id')
    .get(getForId)
    .put(putForId)



module.exports = router;