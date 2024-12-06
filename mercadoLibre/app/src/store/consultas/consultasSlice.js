import { createSlice } from '@reduxjs/toolkit';

export const consultaSlice = createSlice({
    name: 'consulta',
    initialState: {
        active: {},
        consultas: [],
        isRespondiendo: false
    },
    reducers: {
        activar: (state, action) => {
            state.active = action.payload
        },
        respondiendo: (state) => {
            state.isRespondiendo = true
        },
        respondiendoPregunta: (state, action) => {
            state.consultas.find( elem => {
                if(elem.id === action.payload.id){
                    elem.text = action.payload.text
                };
            });

            state.respondiendo = false;
        },
        ponerLista: (state, action) => {
            state.consultas = action.payload
        }
    }
});


// Action creators are generated for each case reducer function
export const { activar, ponerLista, respondiendoPregunta, respondiendo } = consultaSlice.actions;