import { createEntityAdapter } from '@reduxjs/toolkit';

export const requestsAdapter = createEntityAdapter({
    selectId: (request) => request._id,
    sortComparer: (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
});

export const initialRequestsState = requestsAdapter.getInitialState();