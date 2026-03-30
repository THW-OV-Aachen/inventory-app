import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface GuideState {
    lastTopicId: string | null;
}

const initialState: GuideState = {
    lastTopicId: null,
};

export const guideSlice = createSlice({
    name: 'guide',
    initialState,
    reducers: {
        setLastTopic(state, action: PayloadAction<string>) {
            state.lastTopicId = action.payload;
        },
        clearLastTopic(state) {
            state.lastTopicId = null;
        },
    },
});

export const { setLastTopic, clearLastTopic } = guideSlice.actions;
