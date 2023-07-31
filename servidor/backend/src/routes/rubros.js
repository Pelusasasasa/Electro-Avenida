const {Router} = require('express');
const router = Router();

const {post, getsLastCodigo, getsAll, deleteOne, getForCodigo} = require('../controllers/rubros.controllers');

router.route('/')
    .post(post)
    .get(getsAll)
router.route('/codigo')
    .get(getsLastCodigo)
router.route('/:id')  
    .get(getForCodigo)
    .delete(deleteOne)

module.exports = router;