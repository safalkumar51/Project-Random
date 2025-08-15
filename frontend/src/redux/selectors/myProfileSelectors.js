import { createSelector } from '@reduxjs/toolkit';

import { myProfileAdapter, myPostsAdapter } from '../adaptors/myProfileAdapters';


// Get the built-in selectors from the adapters
const myProfileSelectors = myProfileAdapter.getSelectors(
    (state) => state.myProfile
);

const myPostsSelectors = myPostsAdapter.getSelectors(
    (state) => state.myPosts
);

// Basic selectors (provided by the adapter)
export const {
    selectById: selectMyProfileById,
    selectIds: selectMyProfileIds,
} = myProfileSelectors;

export const {
    selectById: selectMyPostsById,
    selectIds: selectMyPostsIds,
} = myPostsSelectors;