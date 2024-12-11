const {Router} = require('express');
const multer = require('multer');

const router = Router();
const storage = multer.memoryStorage()
const upload = multer({ storage });

const { actualizarcodigoML, postOne, getCodigoML, verificarAuthorizacion, subirImagenes } = require('../controllers/codigoML.controllers');


router.route('/')
    .get(getCodigoML)
    .post(postOne)
    .put(actualizarcodigoML)
router.route('/verificarAuthorizacion')
    .get(verificarAuthorizacion)
router.route('/imagenes')
    .post(upload.array('file', 10), subirImagenes)

module.exports = router;