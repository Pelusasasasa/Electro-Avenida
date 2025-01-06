import { useDispatch, useSelector } from "react-redux";
import { clearState, setActive, setLoading, setOrdenes } from "../store/ordenes/ordenesSlice";
import publicacionesApi from "../api/publicacionesApi";



export const useOrdenesStore = () => {
    const { active, isLoading, ordenes} = useSelector(state => state.ordenes);
    const dispatch = useDispatch();

    const startGetOrdenes = async() => {

        try {
            dispatch( setLoading() );
            const { data } = await publicacionesApi.get('codigoML/orders');
             
            dispatch( setOrdenes(data) );
        } catch (error) {
            console.log(error)
        }

    };

    const clearAll = () => {
        dispatch( clearState())
    };

    const startActive = (id) => {
        dispatch( setActive(id) );
    };

    return {
        //* Propiedades
        active,
        isLoading,
        ordenes,

        //* Metodos
        clearAll,
        startActive,
        startGetOrdenes,
    }

};