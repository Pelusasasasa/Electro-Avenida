const {Router} = require('express');
const router = Router();

const {post, id, getAll, deleteOne, getOne, putOne, withSaldo} = require('../controllers/provedor.controllers');


router.route('/')
    .get(getAll)
    .post(post)
router.route('/traerId')
    .get(id)
router.route('/conSaldo')
    .get(withSaldo)
router.route('/codigo/:codigo')
    .get(getOne)
    .put(putOne)
    .delete(deleteOne)

module.exports = router;