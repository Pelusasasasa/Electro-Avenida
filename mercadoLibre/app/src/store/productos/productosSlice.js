import { createSlice } from '@reduxjs/toolkit';

export const productosSlice = createSlice({
    name: 'productos',
    initialState: {
        active: {},
        isSaving: false,
        productos: []
    },
    reducers: {
        emptyProducto: (state, action) => {
            state.active = ''
        },
        setActive: (state, action) => {
            state.active = action.payload
        },
    }
});


// Action creators are generated for each case reducer function
export const { emptyProducto, setActive } = productosSlice.actions;