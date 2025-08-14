import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    posts: [],
    loading: false,
    error: null,
};

const feedSlice = createSlice({
    name: 'feed',
    initialState,
    reducers: {
        setFeedPosts: (state, action) => {
            state.posts = action.payload;
        },
        addFeedPosts: (state, action) => {
            const { page, posts } = action.payload;
            if (page === 1) {
                state.posts = posts;
            } else {
                state.posts = [...state.posts, ...posts];
            }
        },

        addSinglePostFeed: (state, action) => {
            const newPost = action.payload;
            state.posts.unshift(newPost);
        },

        removeFeedPost: (state, action) => {
            state.posts = state.posts.filter(post => post._id !== action.payload);
        },

        toggleFeedLike: (state, action) => {
            const postId = action.payload;
            if (!Array.isArray(state.posts)) return;

            const post = state.posts.find(p => p._id == postId);

            if (post) {
                const wasLiked = post.isLiked;
                post.isLiked = !wasLiked;
                post.likesCount = (post.likesCount || 0) + (wasLiked ? -1 : 1);
            }
        },

        toggleFeedComment: (state, action) => {
            const postId = action.payload;
            if (!Array.isArray(state.posts)) return;

            const post = state.posts.find(p => p._id === postId);

            if (post) {
                post.isCommented = true;
                post.commentsCount = (post.commentsCount || 0) + 1;
            }
        },
    },
});

export const {
    setFeedPosts,
    addFeedPosts,
    addSinglePostFeed,
    removeFeedPost,
    toggleFeedLike,
    toggleFeedComment,
} = feedSlice.actions;

export default feedSlice.reducer;
