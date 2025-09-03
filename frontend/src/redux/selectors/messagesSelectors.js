import { createSelector } from '@reduxjs/toolkit';

import { messagesAdapter } from '../adaptors/messagesAdapters';

// Get the built-in selectors from the adapters
const messagesSelectors = messagesAdapter.getSelectors(
    (state) => state.messages
);

// Basic selectors (provided by the adapter)
export const {
    selectById: selectMessagesById,
    selectIds: selectMessagesIds,
} = messagesSelectors;