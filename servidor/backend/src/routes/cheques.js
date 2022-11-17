const {Router} = require('express');
const router = Router();

const {post, getsAll, putOne, deleteforId, getForId, putForId, getForNumero} = require('../controllers/cheques.controllers');

router.route('/')
    .post(post)
    .get(getsAll)
router.route('/:numero')
    .put(putOne)
router.route('/id/:id')
    .get(getForId)
    .put(putForId)
    .delete(deleteforId)
router.route('/numero/:numero')
    .get(getForNumero)

module.exports = router;
