import { createSlice } from '@reduxjs/toolkit';
import { initialRequestState, requestAdapter } from '../adaptors/otherProfileAdapters';

const RequestSlice = createSlice({
    name: 'request',
    initialState: initialRequestState,
    reducers: {
        setRequest: requestAdapter.setOne,
        clearRequest: requestAdapter.removeAll,
        toggleStatus: (state, action) => {
            const { requestId, status } = action.payload
            const request = state.entities[requestId];
            if (post) {
                request.status = status;
            }
        }
    }
});

export const { setRequest, clearRequest, toggleStatus } = RequestSlice.actions;
export default RequestSlice.reducer;
