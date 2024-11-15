const {Router} = require('express');
const router = Router();

const {post, getdesdeDate, putForId, getForNumeroComp, getAllForProvedor, deleteForId} = require('../controllers/ctate_pro.controllers');

router.route('/')
    .post(post)
router.route('/traerPorProvedorYDesde/:codigo/:desde')
    .get(getdesdeDate)
router.route('/id/:id')
    .put(putForId)
    .delete(deleteForId)
router.route('/numero/:numero')
    .get(getForNumeroComp)
router.route('/codigo/:codigo')
    .get(getAllForProvedor)
module.exports = router