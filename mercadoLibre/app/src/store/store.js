import { configureStore } from '@reduxjs/toolkit';
import { publicacionesSlice } from './publicacones'
import { uiSlice } from './ui'
import { productosSlice } from './productos/productosSlice';
import { consultaSlice } from './consultas';
import { variablesSlice } from './variables';
import { ordenesSlice } from './ordenes/ordenesSlice';


export const store = configureStore({
    reducer: {
        consultas: consultaSlice.reducer,
        productos: productosSlice.reducer,
        ordenes: ordenesSlice.reducer,
        publicaciones: publicacionesSlice.reducer,
        ui: uiSlice.reducer,
        variables: variablesSlice.reducer,
    }
});