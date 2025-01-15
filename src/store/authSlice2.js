// authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    status: false,
    message: "",
};

const authSlice2 = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        successfully: (state, action) => {
            state.status = true;
            state.message = action.payload.message;
        },
    },
});

export const { successfully } = authSlice2.actions;
export default authSlice2.reducer;
