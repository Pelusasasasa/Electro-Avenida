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
        addPublicacion: (state, action ) =>{
            state.publicaciones.push(action.payload);
            state.isSaving = false;
            state.active = '';
        },
        deletePublication:(state, action) => {
            state.active = {};

            state.publicaciones = state.publicaciones.filter( elem => elem.codigoML !== action.payload);

        },
        saved: (state, /* action */ ) => {
            state.isSaving = true
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
            state.active.descripcion = payload.descripcion;

            const aux = state.publicaciones.find(elem => elem.codigoML === payload.codigoML);
            aux.descripcion = payload.descripcion;
            aux.stockML = payload.stockML;
            aux.precioML = payload.precioML;
            aux.tipoVenta = payload.tipoVenta;
            aux.unidadPack = payload.unidadPack;
        },
        
    }
});


// Action creators are generated for each case reducer function
export const { deletePublication, saved, setActive, ponerPublicaciones, putPublicacion, addPublicacion } = publicacionesSlice.actions;