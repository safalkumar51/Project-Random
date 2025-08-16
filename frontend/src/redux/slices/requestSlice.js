import { createSlice } from '@reduxjs/toolkit';
import { initialRequestState, requestAdapter } from '../adaptors/otherProfileAdapters';

const RequestSlice = createSlice({
    name: 'request',
    initialState: initialRequestState,
    reducers: {
        setRequest: requestAdapter.setOne,
        clearRequest: requestAdapter.removeAll,
        updateRequestStatus: (state, action) => {
            const { requestId, status } = action.payload;
            const request = state.entities[requestId];
            if (request) {
                request.status = status;
            }
        }
    }
});

export const { setRequest, clearRequest, updateRequestStatus } = RequestSlice.actions;
export default RequestSlice.reducer;
