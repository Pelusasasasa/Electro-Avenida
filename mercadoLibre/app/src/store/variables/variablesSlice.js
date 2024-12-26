import { createSlice } from '@reduxjs/toolkit';

export const variablesSlice = createSlice({
    name: 'variables',
    initialState: {
        dolar: 0
    },
    reducers: {
        clearAll: (state) => {
            state.dolar = 0;
        },
        setVariables: (state, { payload }) => {
            state.dolar = payload.dolar;
        }

    }
});


// Action creators are generated for each case reducer function
export const { clearAll, setVariables } = variablesSlice.actions;