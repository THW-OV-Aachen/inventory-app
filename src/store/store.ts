import { configureStore } from '@reduxjs/toolkit';
import { searchSlice } from './slices/searchSlice';
import { guideSlice } from './slices/guideSlice';

// Root Redux store (currently also includes guide state).
export const store = configureStore({
    reducer: {
        search: searchSlice.reducer,
        guide: guideSlice.reducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
