// myProfileSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { myProfileAdapter, initialMyProfileState } from '../adaptors/myProfileAdapters';



const myProfileSlice = createSlice({
    name: 'myProfile',
    initialState: initialMyProfileState,
    reducers: {
        setMyProfile: myProfileAdapter.setOne,
        removeMyProfile: myProfileAdapter.removeOne,
        editProfile: (state, action) => {
            const profile = state.entities[action.payload.profileId];
            if (profile) {
                profile.name = action.payload.name;
                profile.bio = action.payload.bio;
            }
        }
        ,
        changeMyProfilePhoto: (state, action) => {
            const profile = state.entities[action.payload.profileId];
            if (profile) {
                profile.profilepic = action.payload.profilepic;
            }
        },

    }
}
);

export const {
    setMyProfile,
    removeMyProfile,
    changeMyProfilePhoto,
    editMyProfile,
} = myProfileSlice.actions;

export default myProfileSlice.reducer;
