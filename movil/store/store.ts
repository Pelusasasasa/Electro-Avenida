import { configureStore } from "@reduxjs/toolkit";
import { productoSlice } from "./producto/productoSlice";

export const store = configureStore({
    reducer: {
        producto: productoSlice.reducer,
    }
})