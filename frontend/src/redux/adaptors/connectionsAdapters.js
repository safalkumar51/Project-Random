import { createEntityAdapter } from '@reduxjs/toolkit';

export const connectionsAdapter = createEntityAdapter({
    selectId: (connection) => connection._id,
    sortComparer: false,
});

export const initialConnectionsState = connectionsAdapter.getInitialState();