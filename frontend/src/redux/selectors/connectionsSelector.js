import { createSelector } from '@reduxjs/toolkit';

import { connectionsAdapter } from '../adaptors/connectionsAdapters';

// Get the built-in selectors from the adapters
const connectionsSelectors = connectionsAdapter.getSelectors(
    (state) => state.connections
);

// Basic selectors (provided by the adapter)
export const {
    selectById: selectConnectionsById,
    selectIds: selectConnectionsIds,
} = connectionsSelectors;