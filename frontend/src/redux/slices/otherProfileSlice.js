import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  posts: [],             
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
    clearOtherProfile: (state) => {
      state.user = null;
      state.posts = [];             
      state.loading = false;
      state.error = null;
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
    toggleOtherLike: (state, action) => {
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
    toggleOtherComment: (state, action) => {
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
  setOtherProfile,
  clearOtherProfile,
  setOtherProfileLoading,
  setOtherProfileError,
  setOtherPosts,
  addOtherPosts,
  addSingleOtherPost,
  removeOtherPost,
  toggleOtherLike,
  toggleOtherComment,
} = otherProfileSlice.actions;

export default otherProfileSlice.reducer;
