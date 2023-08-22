const {Router} = require('express');
const router = Router();

const {post,getAll,getForId,putForId,deletForId} = require('../controllers/difCaja.controllers');

router.route('/')
    .get(getAll)
    .post(post)
router.route('/id/:id')
    .get(getForId)
    .put(putForId)
    .delete(deletForId)



module.exports = router;