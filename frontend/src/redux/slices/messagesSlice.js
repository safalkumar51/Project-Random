import { createSlice } from '@reduxjs/toolkit';

import { messagesAdapter, initialMessagesState } from '../adaptors/messagesAdapters';

const messagesSlice = createSlice({
    name: 'messages',
    initialState: initialMessagesState,
    reducers: {
        setMessages: messagesAdapter.setAll,
        addMessages: messagesAdapter.addMany,
        upsertMessage: messagesAdapter.upsertOne,
        removeMessage: messagesAdapter.removeOne,
        clearMessages: messagesAdapter.removeAll,
        updateUnreadMessageCount: (state, action) => {
            const message = state.entities[action.payload];
            if (message) {
                message.newMessages = 0;
            }
        },
    },
});

export const {
    setMessages,
    addMessages,
    upsertMessage,
    removeMessages,
    clearMessages,
    updateUnreadMessageCount,
} = messagesSlice.actions;

export default messagesSlice.reducer;
