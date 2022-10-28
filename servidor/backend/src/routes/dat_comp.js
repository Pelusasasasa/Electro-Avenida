const {Router} = require('express');
const router = Router();

const {post} = require('../controllers/dat_comp.controllers');

router.route('/')
    .post(post)

module.exports = router;