import { createEntityAdapter } from '@reduxjs/toolkit';

export const requestsAdapter = createEntityAdapter({
    selectId: (request) => request._id,
    sortComparer: false,
});

export const initialRequestsState = requestsAdapter.getInitialState();