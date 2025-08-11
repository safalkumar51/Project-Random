// myProfileSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  posts: [],
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
      const { page, posts } = action.payload;
      if (page === 1) {
        state.posts = posts;
      } else {
        state.posts = [...state.posts, ...posts];
      }
    },
    addSingleMyProfilePost: (state, action) => {
      const newPost = action.payload;
      state.posts.unshift(newPost);
    },
    removeMyProfilePost: (state, action) => {
      state.posts = state.posts.filter(post => post._id !== action.payload);
    },
    toggleMyProfileLike: (state, action) => {
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
    toggleMyProfileComment: (state, action) => {
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
  setMyProfilePosts,
  addMyProfilePosts,
  addSingleMyProfilePost,
  removeMyProfilePost,
  toggleMyProfileLike,
  toggleMyProfileComment,
} = myProfileSlice.actions;

export default myProfileSlice.reducer;
