import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    profile: { posts: [] },
    loading: false,
    error: null,
};

const otherProfileSlice = createSlice({
    name: 'otherProfile',
    initialState,
    reducers: {
        setOtherProfile: (state, action) => {
            state.user = action.payload;
            state.loading = false;
            state.error = null;
        },
        addOtherProfilePosts: (state, action) => {
            const { page, profile } = action.payload;
            if (page === 1) {
                state.profile = profile;
            } else {
                state.profile.posts = [...state.profile.posts, ...profile.posts];
            }
        },
        clearOtherProfile: (state) => {
            state.profile = { posts: [] }
        },
        setOtherProfileLoading: (state, action) => {
            state.loading = action.payload;
        },
        setOtherProfileError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },

        setOtherPosts: (state, action) => {
            state.posts = action.payload;
        },
        addOtherPosts: (state, action) => {
            const { page, posts } = action.payload;
            if (page === 1) {
                state.posts = posts;
            } else {
                state.posts = [...state.posts, ...posts];
            }
        },
        addSingleOtherPost: (state, action) => {
            const newPost = action.payload;
            state.posts.unshift(newPost);
        },
        removeOtherPost: (state, action) => {
            const postId = action.payload;
            state.posts = state.posts.filter(post => post._id !== postId);
        },
        toggleOtherProfileLike: (state, action) => {
            const _id = action.payload;
            const idx = state.posts.findIndex(p => p._id === _id);
            if (idx !== -1) {
                const post = state.posts[idx];
                if (post.isLiked) {
                    post.isLiked = false;
                    post.likeCount = Math.max((post.likeCount || 0) - 1, 0);
                } else {
                    post.isLiked = true;
                    post.likeCount = (post.likeCount || 0) + 1;
                }
            }
        },
        toggleOtherProfileComment: (state, action) => {
            const postId = action.payload;
            if (!Array.isArray(state.profile?.posts)) return;

            const post = state.profile.posts.find(p => p._id === postId);

            if (post) {
                post.isCommented = true;
                post.commentsCount = (post.commentsCount || 0) + 1;
            }
        },
    },
});

export const {
    setOtherProfile,
    addOtherProfilePosts,
    clearOtherProfile,
    setOtherProfileLoading,
    setOtherProfileError,
    setOtherPosts,
    addOtherPosts,
    addSingleOtherPost,
    removeOtherPost,
    toggleOtherProfileLike,
    toggleOtherProfileComment,
} = otherProfileSlice.actions;

export default otherProfileSlice.reducer;
