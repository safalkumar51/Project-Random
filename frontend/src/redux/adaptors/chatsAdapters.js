import { createEntityAdapter } from '@reduxjs/toolkit';

export const chatsAdapter = createEntityAdapter({
    selectId: (chat) => chat._id, // Using postId as the ID
    sortComparer: false,
});

export const initialChatsState = chatsAdapter.getInitialState();