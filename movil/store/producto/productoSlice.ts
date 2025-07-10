import { Producto } from '@/core/types/productos';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProductoState {
    productos: Producto[];
    isLoading: boolean;
    productoActive: Producto | null;
    messageError: string | null;
};

const initialState: ProductoState = {
    productos: [],
    isLoading: false,
    productoActive: null,
    messageError: null
}

export const productoSlice = createSlice({
    name: 'producto',
    initialState,
    reducers: {
        loading: (state) => {
            state.isLoading = true;
        },
        setProductos: (state, { payload }: PayloadAction<Producto[]>) => {
            state.productos = payload;
            state.isLoading = false;
        },
        setProductoActive: (state, { payload }: PayloadAction<Producto>) => {
            state.productoActive = payload
        },
        setMessageError: (state, { payload }: PayloadAction<string>) => {
            state.messageError = payload
        },

    }
});


// Action creators are generated for each case reducer function
export const { 
    loading,
    setMessageError,
    setProductoActive,
    setProductos,
} = productoSlice.actions;