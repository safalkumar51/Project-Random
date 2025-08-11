import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  messages: [],
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessages: (state, action) => {
      const { page, data } = action.payload;
      if (page === 1) {
        state.messages = data;
      } else {
        state.messages = [...data, ...state.messages];
      }
    },

    addSingleMessage: (state, action) => {
      state.messages.push(action.payload);
    },

    removeMessage: (state, action) => {
      state.messages = state.messages.filter(
        (msg) => msg._id !== action.payload
      );
    },

    clearMessages: (state) => {
      state.messages = [];
    },
  },
});

export const {
  addMessages,
  addSingleMessage,
  removeMessage,
  clearMessages,
} = chatSlice.actions;

export default chatSlice.reducer;
