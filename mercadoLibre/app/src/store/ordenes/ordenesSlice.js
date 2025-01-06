import { createSlice } from '@reduxjs/toolkit';

export const ordenesSlice = createSlice({
    name: 'ordenes',
    initialState: {
        ordenes: [],
        active: {},
        isLoading: false
    },
    reducers: {
        setActive: (state, { payload }) => {
            state.active = state.ordenes.find(orden => orden.id == payload);
        },
        setLoading: (state, /* action */ ) => {
            state.isLoading = true;
        },
        setOrdenes: (state, { payload }) => {
            state.ordenes = payload;
            state.isLoading = false;
        },
        clearState: (state) => {
            state.ordenes = [];
            state.active = {};
            state.isLoading = false;
        }
    }
});


// Action creators are generated for each case reducer function
export const { clearState, setActive, setLoading, setOrdenes } = ordenesSlice.actions;