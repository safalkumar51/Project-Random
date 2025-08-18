import { createSlice } from '@reduxjs/toolkit';

import { messagesAdapter, initialMessagesState } from '../adaptors/messagesAdapters';

const messagesSlice = createSlice({
  name: 'messages',
  initialState: initialMessagesState,
  reducers: {
    setMessages: messagesAdapter.setAll,
    addMessages: messagesAdapter.addMany,
    upsertMessage: messagesAdapter.upsertOne,
    removeMessage: messagesAdapter.removeOne,
    clearMessages: messagesAdapter.removeAll,
  },
});

export const {
  setMessages,
  addMessages,
  upsertMessage,
  removeMessages,
  clearMessages,
} = messagesSlice.actions;

export default messagesSlice.reducer;
