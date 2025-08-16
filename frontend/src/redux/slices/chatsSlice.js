import { createSlice } from '@reduxjs/toolkit';

import { chatsAdapter, initialChatsState } from '../adaptors/chatsAdapters';

const chatsSlice = createSlice({
    name: 'chat',
    initialState: initialChatsState,
    reducers: {
        setChats: chatsAdapter.setAll,
        addChats:chatsAdapter.addMany,
        addChat:chatsAdapter.addOne,
        removeChat:chatsAdapter.removeOne,
        clearChats: chatsAdapter.removeAll,
    },
});

export const {
    setChats,
    addChats,
    addChat,
    removeChat,
    clearChats,
} = chatsSlice.actions;

export default chatsSlice.reducer;
