import { electroApi } from "@/core/api/electroApi";
import { Producto } from "@/core/types/productos";
import { loading, setProductos } from "@/store/producto/productoSlice";
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
            const { data } = await electroApi(`productos/buscarProducto/${texto === '' ? 'textoVacio' : texto}/descripcion`);
            dispatch(setProductos(data))
        } catch (error) {
            console.log(error);
        }
    };

    const startTraerImagen = async(id: string) => {
        try {
            const { data } = await electroApi(`productos/${id}/image`);

            return data
        } catch (error) {
            console.log(error);
            return ''
        }
    };

    return {
        //Atributos
        isLoading,
        productos,
        productoActive,

        //Metodos
        startTraerProductosPorTexto,
        startTraerImagen
    }
}