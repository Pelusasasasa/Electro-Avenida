const {Router} = require('express');
const router = Router();

const {crearPdf} = require('../controllers/pdf.controllers');

router.route('/')
.post(crearPdf)


module.exports = router;