const {Router} = require('express');
const router = Router();

const {post, getsAll, putOne, deleteforId, getForId, putForId} = require('../controllers/cheques.controllers');

router.route('/')
    .post(post)
    .get(getsAll)
router.route('/:numero')
    .put(putOne)
router.route('/id/:id')
    .get(getForId)
    .put(putForId)
    .delete(deleteforId)
module.exports = router;
