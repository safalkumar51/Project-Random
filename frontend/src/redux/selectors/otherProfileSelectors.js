import { createSelector } from '@reduxjs/toolkit';

import { otherPostsAdapter, otherProfileAdapter, requestAdapter } from '../adaptors/otherProfileAdapters';

const OtherProfileSelectors = otherProfileAdapter.getSelectors(
    (state) => state.otherProfile
);

const OtherPostsSelectors = otherPostsAdapter.getSelectors(
    (state) => state.otherPosts
);

const RequestSelectors = requestAdapter.getSelectors(
    (state) => state.request
);

// Basic selectors (provided by the adapter)
export const {
    selectById: selectOtherProfileById,
    selectIds: selectOtherProfileIds,
} = OtherProfileSelectors;

export const {
    selectById: selectOtherPostsById,
    selectIds: selectOtherPostsIds,
} = OtherPostsSelectors;

export const {
    selectById: selectRequestById,
    selectIds: selectRequestIds,
} = RequestSelectors;