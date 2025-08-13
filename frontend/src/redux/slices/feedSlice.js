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

    toggleFeedComment: (state, action) => {
      const _id = action.payload;
      const idx = state.posts.findIndex(p => p._id === _id);

      if (idx !== -1) {
        const post = state.posts[idx];
        post.isCommented = !post.isCommented;
        const delta = post.isCommented ? 1 : -1;
        post.commentCount = Math.max((post.commentCount || 0) + delta, 0);
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
