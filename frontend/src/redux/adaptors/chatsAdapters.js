import { createEntityAdapter } from '@reduxjs/toolkit';

export const chatsAdapter = createEntityAdapter({
    selectId: (chat) => chat._id, // Using postId as the ID
    sortComparer: (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
});

export const initialChatsState = chatsAdapter.getInitialState();