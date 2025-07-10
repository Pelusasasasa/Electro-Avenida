const {Router} = require("express");
const router = Router();

const multer = require('multer');
const storage = multer.diskStorage({
            destination:(req,file,cb)=>{
            cb(null,"imagenes");
            },
            filename:(req,file,cb)=>{
                cb(null,`${file.originalname}`);
            }}
);

const upload = multer({storage});
const {crearProducto,traerProductos,modificarProductos,getproducto,modificarProducto,borrarProducto,productosPorMarca,traerProductosPorRango,stockNegativo,traerMarcas,subirImagen,mostrarImagen, getStockCero, putStockCero, getProvedores, productosPorProvedor, buscarProducto} = require("../controllers/productos.controllers");

router.route('/')
    .post(crearProducto)
    .get(traerMarcas)
    .put(modificarProductos)

router.route('/filtrar/:text')
    .get(buscarProducto)

router.route('/buscarProducto/:texto/:tipoBusqueda')
    .get(traerProductos)

router.route('/stockCero')
    .get(getStockCero)
    .put(putStockCero)

router.route('/provedores')
    .get(getProvedores)

router.route('/provedores/:provedor')
    .get(productosPorProvedor)

router.route('/:id')
    .get(getproducto)
    .put(modificarProducto)
    .delete(borrarProducto)

router.route('/:productosEntreRangos/:desde/:hasta')
    .get(traerProductosPorRango)

router.route('/marcas/:marca')
    .get(productosPorMarca)


router.route('/:id/image')
    .put(upload.single('imagen'),subirImagen)
    .get(upload.single('imagen'),mostrarImagen)

module.exports = router