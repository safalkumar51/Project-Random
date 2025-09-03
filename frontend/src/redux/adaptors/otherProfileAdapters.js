import { createEntityAdapter } from '@reduxjs/toolkit';

export const otherProfileAdapter = createEntityAdapter({
    selectId: (profile) => profile._id, // Using postId as the ID
});

export const initialOtherProfileState = otherProfileAdapter.getInitialState();

export const otherPostsAdapter = createEntityAdapter({
    selectId: (post) => post._id,
    sortComparer: (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
});

export const initialOtherPostsState = otherPostsAdapter.getInitialState();

export const requestAdapter = createEntityAdapter({
    selectId: (request) => request._id,
});

export const initialRequestState = requestAdapter.getInitialState();