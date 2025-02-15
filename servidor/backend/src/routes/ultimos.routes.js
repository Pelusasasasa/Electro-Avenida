const {Router} = require('express'); 
const router = Router();


const {post, get, put, getLast} = require('../controllers/ultimos.controllers');

router.route('/')
    .post(post)
    .get(getLast)
    .put(put)

module.exports = router