import { createSlice } from '@reduxjs/toolkit';

export const uiSlice = createSlice({
    name: 'ui',
    initialState: {
        isOpenModal: false
    },
    reducers: {
        openModal: (state, /* action */ ) => {
            state.isOpenModal = true
        },
        closeModal: (state) => {
            state.isOpenModal = false
        }
    }
});


// Action creators are generated for each case reducer function
export const { openModal, closeModal } = uiSlice.actions;