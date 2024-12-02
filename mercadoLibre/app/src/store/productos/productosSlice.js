import { createSlice } from '@reduxjs/toolkit';

export const productosSlice = createSlice({
    name: 'productos',
    initialState: {
        active: {},
        isSaving: false,
        productos: []
    },
    reducers: {
        setActive: (state, action) => {
            state.active = action.payload
        }
    }
});


// Action creators are generated for each case reducer function
export const { setActive } = productosSlice.actions;