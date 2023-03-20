const {Router} = require('express');
const router = Router();

const {post, getdesdeDate, putForId, getForNumeroComp} = require('../controllers/ctate_pro.controllers');

router.route('/')
    .post(post)
router.route('/traerPorProvedorYDesde/:codigo/:desde')
    .get(getdesdeDate)
router.route('/id/:id')
    .put(putForId)
router.route('/numero/:numero')
    .get(getForNumeroComp)

module.exports = router