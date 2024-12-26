import { useDispatch } from "react-redux";
import publicacionesApi from "../api/publicacionesApi";
import { setVariables } from "../store/variables/variablesSlice";

export const useVariableStore = () => {
    const dispatch = useDispatch();

    const startGetVariables = async() => {
        const { data } = await publicacionesApi.get('tipoVenta');

        dispatch( setVariables(data) );
    }

    return {
        //* Propiedades

        //* Metodos
        startGetVariables,
    }
};