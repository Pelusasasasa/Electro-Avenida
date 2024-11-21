import { getProducto } from "../../helpers/productos.helpers";
import { setActive } from "./productosSlice";

export const setProducto = (id) => {
    return async(dispatch) => {
        const res = await getProducto(id);
        dispatch( setActive(res) );
    };
};