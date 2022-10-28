const { Router } = require('express');
const router = Router();

const {post, getAll, impTotal ,borrar, getForID, putForID, getForPersonal, getForCliente, getForIncobrable} = require('../controllers/Vale.controllers');

router.route('/')
    .post(post)
    .get(getAll)
router.route('/imptotal')
    .get(impTotal)
router.route('/personal')
    .get(getForPersonal)
router.route('/cliente')
    .get(getForCliente)
router.route('/incobrable')
    .get(getForIncobrable)
router.route('/id/:id')
    .get(getForID)
    .put(putForID)
    .delete(borrar)
module.exports = router
