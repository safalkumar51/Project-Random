import { createEntityAdapter } from '@reduxjs/toolkit';

export const messagesAdapter = createEntityAdapter({
    selectId: (message) => message._id, // Using postId as the ID
    sortComparer: false,
});

export const initialMessagesState = messagesAdapter.getInitialState();