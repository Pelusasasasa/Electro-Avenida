const {Router} = require('express')
const router = Router();

const {postRemito,getAllRemitos} = require('../controllers/remito.controllers');

router.route('/')
    .post(postRemito)
    .get(getAllRemitos)

module.exports = router;