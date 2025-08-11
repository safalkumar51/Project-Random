import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  requests: [],
};

const requestsSlice = createSlice({
  name: 'requests',
  initialState,
  reducers: {
     addRequests: (state, action) => {
      const { page, data } = action.payload;
      if (page === 1) {
        state.requests = data;
      } else {
        state.requests = [...state.requests, ...data];
      }
    },
    removeRequest: (state, action) => {
      state.requests = state.requests.filter(
        (req) => req._id !== action.payload
      );
    },
    updateRequestStatus: (state, action) => {
    const {_id, status } = action.payload;
    const requestIndex = state.requests.findIndex((req) => req._id === _id);
    if(requestIndex !== -1){
    state.requests[requestIndex].status = status;
    }
},
   addRequestToFront : (state,action) =>{
    state.requests.unshift(action.payload);
   }
  },
});

export const {
  addRequests,
  removeRequest,
  updateRequestStatus,
  addRequestToFront,
} = requestsSlice.actions;

export default requestsSlice.reducer;
