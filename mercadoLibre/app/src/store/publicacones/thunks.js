import { modificarPublicacion, traerPublicacion, traerPublicaciones } from "../../helpers";
import { ponerPublicaciones, putPublicacion, setActive } from "./publicacionesSlice";

export const getPublicaciones = () => {
    return async(dispatch) => {
        const res = await traerPublicaciones();

        dispatch( ponerPublicaciones(res) )
    };
};

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
}