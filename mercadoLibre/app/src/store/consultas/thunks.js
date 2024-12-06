import { responder, traerConsulta, traerConsultas } from "../../helpers/consultas.helpers";
import { activar, ponerLista, respondiendoPregunta } from "./consultasSlice";

export const  getConsultas = () => {
    return async(dispatch) => {
        const res = await traerConsultas();

        await dispatch( ponerLista(res.questions))
    };
};

export const ponerActivo = (id) => {
    return async (dispatch) => {
        const res = await traerConsulta(id);

        dispatch(activar(res));
    };
};

export const responderConsulta = (id, text) => {

    return async (dispatch) => {
        const res = await responder(id, text);
        console.log(res)

        dispatch(respondiendoPregunta(res));
    };
};
