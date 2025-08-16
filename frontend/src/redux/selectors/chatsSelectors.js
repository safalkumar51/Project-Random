import { createSelector } from '@reduxjs/toolkit';

import { chatsAdapter } from '../adaptors/chatsAdapters';

// Get the built-in selectors from the adapters
const chatsSelectors = chatsAdapter.getSelectors(
    (state) => state.chats
);

// Basic selectors (provided by the adapter)
export const {
    selectById: selectChatsById,
    selectIds: selectChatsIds,
} = chatsSelectors;