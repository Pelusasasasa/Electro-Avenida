const {Router} = require('express'); 
const router = Router();


const {post, get, put} = require('../controllers/ultimos.controllers');

router.route('/')
    .post(post)
    .get(get)
    .put(put)

module.exports = router