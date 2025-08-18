import { createSlice } from '@reduxjs/toolkit';

import { connectionsAdapter, initialConnectionsState } from '../adaptors/connectionsAdapters';

const connectionsSlice = createSlice({
  name: 'connections',
  initialState: initialConnectionsState,
  reducers: {
    setConnections: connectionsAdapter.setAll,
    addConnections: connectionsAdapter.addMany,
    addConnection: connectionsAdapter.addOne,
    removeConnection: connectionsAdapter.removeOne,
    clearConnections: connectionsAdapter.removeAll,
    updateConnectionStatus: (state,action)=>{
      const {_id,status} = action.payload;
      const connection = state.entities[_id];
      if(connection){
        connection.status = status;
      }
    },
  },
});

export const {
  setConnections,
  addConnections,
  addConnection,
  removeConnection,
  clearConnections,
  updateConnectionStatus,
} = connectionsSlice.actions;

export default connectionsSlice.reducer;
