import { createSlice } from '@reduxjs/toolkit';
import { initialOtherProfileState, otherProfileAdapter } from '../adaptors/otherProfileAdapters';

const OtherProfileSlice = createSlice({
    name: 'otherProfile',
    initialState: initialOtherProfileState,
    reducers: {
        setOtherProfile: otherProfileAdapter.setOne,
        clearOtherProfile: otherProfileAdapter.removeAll,
    }
});

export const { setOtherProfile, clearOtherProfile } = OtherProfileSlice.actions;
export default OtherProfileSlice.reducer;
