const {Router} = require('express');
const router = Router();

const {post, getAll, getForId, putForId} = require('../controllers/factura.controllers');

router.route('/')
    .post(post)
    .get(getAll)

router.route('/id/:id')
    .get(getForId)
    .put(putForId)

module.exports = router;