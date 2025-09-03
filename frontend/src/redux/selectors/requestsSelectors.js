import { createSelector } from '@reduxjs/toolkit';

import { requestsAdapter } from '../adaptors/requestsAdapter';

// Get the built-in selectors from the adapters
const requestsSelectors = requestsAdapter.getSelectors(
    (state) => state.requests
);

// Basic selectors (provided by the adapter)
export const {
    selectById: selectRequestsById,
    selectIds: selectRequestsIds,
} = requestsSelectors;