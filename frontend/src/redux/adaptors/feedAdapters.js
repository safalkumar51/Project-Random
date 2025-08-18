import { createEntityAdapter } from '@reduxjs/toolkit';

export const feedAdapter = createEntityAdapter({
    selectId: (post) => post._id, // Using postId as the ID
    sortComparer: (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
});

export const initialFeedState = feedAdapter.getInitialState();