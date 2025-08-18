import { createSelector } from '@reduxjs/toolkit';

import { feedAdapter } from '../adaptors/feedAdapters';

// Get the built-in selectors from the adapters
const feedSelectors = feedAdapter.getSelectors(
    (state) => state.feed
);

// Basic selectors (provided by the adapter)
export const {
    selectById: selectFeedPostById,
    selectIds: selectFeedPostsIds,
} = feedSelectors;