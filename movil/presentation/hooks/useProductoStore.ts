import { electroApi } from "@/core/api/electroApi";
import { Producto } from "@/core/types/productos";
import { loading, setProductos } from "@/store/producto/productoSlice";
import { Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";

interface RootState {
    producto: {
        productos: Producto[];
        productoActive: Producto | null;
        isLoading: boolean;
        messageError: string | null;
    }
}

export const useProductoStore = () => {
    const { productoActive, productos, isLoading } = useSelector((state: RootState) => state.producto)
    const dispatch = useDispatch();

    const startTraerProductosPorTexto = async(texto: string) => {
        try {
            dispatch(loading())
            const { data } = await electroApi.get(`productos/filtrar/${!texto ? 'textoVacio' : texto}`);
            if(data.ok){
                dispatch(setProductos(data.productos))
            }else{
                await Alert.alert('No se pudo obtener los productos')
            }
        } catch (error) {
            console.log(error);
        }
    };

    return {
        //Atributos
        isLoading,
        productos,
        productoActive,

        //Metodos
        startTraerProductosPorTexto,
    }
}