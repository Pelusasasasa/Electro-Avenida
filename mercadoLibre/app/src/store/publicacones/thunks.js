import { deleteOnePublicacion, modificarPublicacion, traerPublicacion, traerPublicaciones } from "../../helpers";
import { publicarML } from "../../helpers/funciones";
import { addPublicacion, deletePublication, ponerPublicaciones, putPublicacion, setActive } from "./publicacionesSlice";


export const activarPublicacion = (id) => {
    return async(dispatch) => {
        const res = await traerPublicacion(id)
        dispatch( setActive(res) )
    }
};

export const actualizarPublicacion = (id, precio, stock) => {
    return async(dispatch) => {
        const res = await modificarPublicacion(id, precio, stock);

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
        console.log(JSON.stringify(pro))
        const res = await publicarML(pro)
        
        // const publicacion = {};
        // publicacion.codigoML = res.id;
        // publicacion.descripcion = res.title;
        // publicacion.precioML = res.price;
        // publicacion.stockML = res.available_quantity;
        // publicacion.categoria = res.category_id;

        // const respuesta = await postPublicaciones(publicacion);
        // dispatch( addPublicacion(respuesta) );
    }
};

export const subirImagenes = async(files) => {
    console.log(files)

    for(let elem of files){
        (await axios.post(`${URL}pictures/items/upload`))
    }
};
//"The body does not contains some or none of the following properties [listing_type_id]"

