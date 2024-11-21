import { configureStore } from '@reduxjs/toolkit';
import { publicacionesSlice } from './publicacones'
import { uiSlice } from './ui'


export const store = configureStore({
    reducer: {
        publicaciones: publicacionesSlice.reducer,
        ui: uiSlice.reducer
    }
});