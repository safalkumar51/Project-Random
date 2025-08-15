import { createEntityAdapter } from '@reduxjs/toolkit';


export const postAdapter = createEntityAdapter({
    selectId: (post) => post._id, // Using postId as the ID
});

export const initialPostState = postAdapter.getInitialState();

export const commentsAdapter = createEntityAdapter({
    selectId: (comment) => comment._id,
    sortComparer: false
});

export const initialCommentsState = commentsAdapter.getInitialState();