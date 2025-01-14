import { agregarPublicaciones, deleteOnePublicacion, modificarPublicacion, traerPublicacion, traerPublicaciones } from "../../helpers";
import { publicarML } from "../../helpers/funciones";
import { addPublicacion, deletePublication, ponerPublicaciones, putPublicacion, setActive } from "./publicacionesSlice";
import { emptyProducto } from "../productos/productosSlice";


export const activarPublicacion = (id) => {
    return async(dispatch) => {
        const res = await traerPublicacion(id)
        dispatch( setActive(res) )
    }
};

export const actualizarPublicacion = (id, precio, stock, tipoVenta, unidadPack) => {
    return async(dispatch) => {
        const res = await modificarPublicacion(id, precio, stock, tipoVenta, unidadPack);
        dispatch(putPublicacion(res))
    }
};

export const eliminarPublicacion = (codigoML) => {
    return async(dispatch) => {
        await deleteOnePublicacion(codigoML)

        dispatch(deletePublication(codigoML));
    };
}

export const getPublicaciones = () => {
    return async(dispatch) => {
        const res = await traerPublicaciones();

        dispatch( ponerPublicaciones(res) )
    };
};

export const postPublicaciones = (pro) => {
    return async(dispatch) => {
        const res = await publicarML(pro)
        

        const codProd = res.attributes.find(elem => elem.id === 'SELLER_SKU');
        const publicacion = {};
        publicacion.codigoML = res.id;
        publicacion.descripcion = res.title;
        publicacion.precioML = res.price;
        publicacion.stockML = res.available_quantity;
        publicacion.categoria = res.category_id;
        publicacion.codProd = codProd.value_name;

        const respuesta = await agregarPublicaciones(publicacion);

        dispatch( addPublicacion(respuesta) );

        dispatch( emptyProducto() )
    }
};


//"The body does not contains some or none of the following properties [listing_type_id]"

