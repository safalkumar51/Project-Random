import { createSlice } from '@reduxjs/toolkit';

import { requestsAdapter, initialRequestsState } from '../adaptors/requestsAdapter';

const requestsSlice = createSlice({
    name: 'requests',
   initialState : initialRequestsState,
    reducers: {
        setRequests : requestsAdapter.setAll,
        addRequests: requestsAdapter.addMany,
        addRequest: requestsAdapter.addOne,
        removeRequest: requestsAdapter.removeOne,
        clearRequests: requestsAdapter.removeAll,
        updateRequestStatus: (state, action) => {
        const { _id, status } = action.payload;
        const request = state.entities[_id];
        if (request) {
        request.status = status;
        }
        },
    }
});

export const {
    setRequests,
    addRequests,
    removeRequest,
    clearRequests,
    updateRequestStatus,
    addRequest,
} = requestsSlice.actions;

export default requestsSlice.reducer;
