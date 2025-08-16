import { createEntityAdapter } from '@reduxjs/toolkit';

export const myProfileAdapter = createEntityAdapter({
    selectId: (profile) => profile._id, // Using postId as the ID
});

export const initialMyProfileState = myProfileAdapter.getInitialState();

export const myPostsAdapter = createEntityAdapter({
    selectId: (post) => post._id,
    sortComparer: false
});

export const initialMyPostsState = myPostsAdapter.getInitialState();