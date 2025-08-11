import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  connections: [],
};

const connectionsSlice = createSlice({
  name: 'connections',
  initialState,
  reducers: {
    addConnection: (state, action) => {
      state.connections.unshift(action.payload);
    },
    addConnections: (state, action) => {
      const { page, connections } = action.payload;

      if (page === 1) {
        state.connections = connections;
      } else {
        state.connections = [...state.connections, ...connections];
      }
    },
    removeConnection: (state, action) => {
      state.connections = state.connections.filter(
        (conn) => conn._id !== action.payload
      );
    },
  },
});

export const {
  addConnection,
  addConnections,
  removeConnection,
} = connectionsSlice.actions;

export default connectionsSlice.reducer;
