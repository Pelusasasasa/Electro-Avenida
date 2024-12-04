const {Router} = require('express');
const router = Router();

const {post, getsLastCodigo, getsAll, deleteOne, getForCodigo, putOne} = require('../controllers/rubros.controllers');

router.route('/')
    .post(post)
    .get(getsAll)
router.route('/codigo')
    .get(getsLastCodigo)
router.route('/:id')  
    .get(getForCodigo)
    .put(putOne)
    .delete(deleteOne)

module.exports = router;