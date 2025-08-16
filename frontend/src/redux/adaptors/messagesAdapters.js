import { createEntityAdapter } from '@reduxjs/toolkit';

export const messagesAdapter = createEntityAdapter({
    selectId: (message) => message._id, // Using postId as the ID
    sortComparer: (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
});

export const initialMessagesState = messagesAdapter.getInitialState();