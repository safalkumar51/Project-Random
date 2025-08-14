// myProfileSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    profile: { posts: [] },
    loading: false,
    error: null,
};

const myProfileSlice = createSlice({
    name: 'myProfile',
    initialState,
    reducers: {
        setMyProfilePosts: (state, action) => {
            state.posts = action.payload;
        },
        addMyProfilePosts: (state, action) => {
            const { page, profile } = action.payload;
            if (page === 1) {
                state.profile = profile;
            } else {
                state.profile.posts = [...state.profile.posts, ...profile.posts];
            }
        },
        addSinglePostMyProfile: (state, action) => {
            const newPost = action.payload;
            state.profile.posts.unshift(newPost);
        },
        removeMyProfilePost: (state, action) => {
            state.posts = state.posts.filter(post => post._id !== action.payload);
        },
        toggleMyProfileLike: (state, action) => {
            const postId = action.payload;
            if (!Array.isArray(state.profile?.posts)) return;

            const post = state.profile.posts.find(p => p._id == postId);

            if (post) {
                const wasLiked = post.isLiked;
                post.isLiked = !wasLiked;
                post.likesCount = (post.likesCount || 0) + (wasLiked ? -1 : 1);
            }
        },
        toggleMyProfileComment: (state, action) => {
            const postId = action.payload;
            if (!Array.isArray(state.profile?.posts)) return;

            const post = state.profile.posts.find(p => p._id === postId);

            if (post) {
                post.isCommented = true;
                post.commentsCount = (post.commentsCount || 0) + 1;
            }
        },
        setMyProfileLoading: (state, action) => {
            const loading = action.payload;
            state.loading = loading;
        }
    },
});

export const {
    setMyProfilePosts,
    addMyProfilePosts,
    addSinglePostMyProfile,
    removeMyProfilePost,
    toggleMyProfileLike,
    toggleMyProfileComment,
    setMyProfileLoading,
} = myProfileSlice.actions;

export default myProfileSlice.reducer;
