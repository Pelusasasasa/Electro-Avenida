const {Router} = require('express');
const router = Router();

const {post} = require('../controllers/com_pago.controllers');


router.route('/')
    .post(post)

module.exports = router;