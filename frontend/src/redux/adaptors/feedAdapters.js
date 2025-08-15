import { createEntityAdapter } from '@reduxjs/toolkit';

export const feedAdapter = createEntityAdapter({
    selectId: (post) => post._id, // Using postId as the ID
    sortComparer: false,
});

export const initialFeedState = feedAdapter.getInitialState();