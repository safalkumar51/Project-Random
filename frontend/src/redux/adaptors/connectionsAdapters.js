import { createEntityAdapter } from '@reduxjs/toolkit';

export const connectionsAdapter = createEntityAdapter({
    selectId: (connection) => connection._id,
    sortComparer: (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
});

export const initialConnectionsState = connectionsAdapter.getInitialState();