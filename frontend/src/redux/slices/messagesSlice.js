import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  messages: [],
};

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessages: (state, action) => {
      const { page, data } = action.payload;
      if (page === 1) {
        state.messages = data; 
      } else {
        state.messages = [...state.messages, ...data]; 
      }
    },
    addSingleMessageToFront: (state, action) => {
      state.messages.unshift(action.payload);
    },
    removeMessage: (state, action) => {
      state.messages = state.messages.filter((msg) => msg._id !== action.payload);
    },
  },
});

export const {
  addMessages,
  addSingleMessageToFront,
  removeMessage,
} = messagesSlice.actions;

export default messagesSlice.reducer;
