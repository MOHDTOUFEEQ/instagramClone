// authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    status: false,
    userData: null,
    messageStatus: false,
    message: "heyybro"
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action) => {
            state.status = true;
            state.userData = action.payload.userData;
        },
        logout: (state) => {
            state.status = false;
            state.userData = null;
        },
        successfully: (state, action) => {
            state.messageStatus = action.payload.messageStatus;
            state.message = action.payload.message;
          },
    }
});

export const { login, logout, successfully } = authSlice.actions;
export default authSlice;
 