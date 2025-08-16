import { createSlice } from '@reduxjs/toolkit';

import { messagesAdapter, initialMessagesState } from '../adaptors/messagesAdapters';

const messagesSlice = createSlice({
  name: 'messages',
  initialState: initialMessagesState,
  reducers: {
    setMessages: messagesAdapter.setAll,
    addMessages: messagesAdapter.addMany,
    addMessage: messagesAdapter.addOne,
    removeMessage: messagesAdapter.removeOne,
    clearMessages: messagesAdapter.removeAll,
  },
});

export const {
  setMessages,
  addMessages,
  addMessage,
  removeMessages,
  clearMessages,
} = messagesSlice.actions;

export default messagesSlice.reducer;
