const {Router} = require('express');
const router = Router();

const {post} = require('../controllers/ctate_pro.controllers');

router.route('/')
    .post(post)

module.exports = router