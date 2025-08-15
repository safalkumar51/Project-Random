import { createEntityAdapter } from '@reduxjs/toolkit';

export const profileAdapter = createEntityAdapter({
    selectId: (profile) => profile._id, // Using postId as the ID
});

export const initialProfileState = profileAdapter.getInitialState();

export const postsAdapter = createEntityAdapter({
    selectId: (post) => post._id,
    sortComparer: false
});

export const initialCommentsState = postsAdapter.getInitialState();