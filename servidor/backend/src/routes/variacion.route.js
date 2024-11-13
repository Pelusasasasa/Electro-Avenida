const { Router } = require('express');
const router = Router();

const { postMany, putMany, getForPublicacionId } = require('../controllers/variacion.controllers');

router.route('/')
    .post(postMany)
    .put(putMany)
router.route('/forPublicacion') 
    .get(getForPublicacionId)

module.exports = router;