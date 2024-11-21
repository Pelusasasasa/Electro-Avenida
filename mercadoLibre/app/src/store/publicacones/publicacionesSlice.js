import { createSlice } from '@reduxjs/toolkit';

export const publicacionesSlice = createSlice({
    name: 'publicaciones',
    initialState: {
        publicaciones: [],
        active: {},
        productoRelacionado: {},
        isSaving: false
    },
    reducers: {
        deletePublication:(state, action) => {
            state.active = {};

            state.publicaciones = state.publicaciones.filter( elem => elem.codigoML !== action.payload);

        },
        saved: (state, /* action */ ) => {
            state.isSaving = false
        },
        setActive: (state, action) =>{
            state.active = action.payload
        },
        ponerPublicaciones:(state, action) => {
            state.publicaciones = action.payload
        },
        putPublicacion: (state, {payload}) => {
            state.active.precioML = payload.precioML;
            state.active.stockML = payload.stockML;

            const aux = state.publicaciones.find(elem => elem.codigoML === payload.codigoML);
            aux.stockML = payload.stockML;
            aux.precioML = payload.precioML
        },
        
    }
});


// Action creators are generated for each case reducer function
export const { deletePublication, saved, setActive, ponerPublicaciones, putPublicacion } = publicacionesSlice.actions;