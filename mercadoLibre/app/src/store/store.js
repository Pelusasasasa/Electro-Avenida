import { configureStore } from '@reduxjs/toolkit';
import { publicacionesSlice } from './publicacones'
import { uiSlice } from './ui'
import { productosSlice } from './productos/productosSlice';


export const store = configureStore({
    reducer: {
        publicaciones: publicacionesSlice.reducer,
        ui: uiSlice.reducer,
        productos: productosSlice.reducer
    }
});