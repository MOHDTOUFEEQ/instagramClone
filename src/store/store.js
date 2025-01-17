import {configureStore} from '@reduxjs/toolkit';
import authSlice from './authSlice';

const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        // Add more slices if needed
    }
});

export default store;