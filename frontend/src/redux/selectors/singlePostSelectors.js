import { createSelector } from '@reduxjs/toolkit';

import { postAdapter, commentsAdapter } from '../adaptors/singlePostAdapters';


// Get the built-in selectors from the adapters
const postSelectors = postAdapter.getSelectors(
    (state) => state.singlePost
);

const commentsSelectors = commentsAdapter.getSelectors(
    (state) => state.singlePostComments
);

// Basic selectors (provided by the adapter)
export const {
    selectById: selectSinglePostById,
    selectIds: selectSinglePostIds,
} = postSelectors;

export const {
    selectById: selectCommentById,
    selectIds: selectCommentIds,
} = commentsSelectors;