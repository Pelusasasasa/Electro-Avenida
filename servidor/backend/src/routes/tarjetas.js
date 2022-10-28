const {Router} = require('express');
const router = Router();

const {post, getAll, putForId, getForId, deleteId} = require('../controllers/tarjeta.controllers');

router.route('/')
    .post(post)
    .get(getAll)
router.route('/id/:id')
    .get(getForId)
    .put(putForId)
    .delete(deleteId)

module.exports = router    
