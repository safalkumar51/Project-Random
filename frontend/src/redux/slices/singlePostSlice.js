import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  post: null,
  loading: false,
  error: null,
};

const singlePostSlice = createSlice({
  name: 'singlePost',
  initialState,
  reducers: {
    setSinglePost: (state, action) => {
      state.post = action.payload;
      state.loading = false;
      state.error = null;
    },
    clearSinglePost: (state) => {
      state.post = null;
      state.loading = false;
      state.error = null;
    },
    // keep API-driven updates consistent with local keys
    updatePostLikes: (state, action) => {
      if (state.post) {
        state.post.likeCount = action.payload;   // <- unify on likeCount
      }
    },
    updatePostComments: (state, action) => {
      if (state.post) {
        state.post.comments = action.payload;    // full thread replace
        state.post.commentCount = Array.isArray(action.payload) ? action.payload.length : 0;
      }
    },
    setSinglePostLoading: (state, action) => {
      state.loading = action.payload;
    },
    setSinglePostError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    // like toggle (use same pattern as list slices)
    toggleLike: (state) => {
      if (!state.post) return;
      state.post.isLiked = !state.post.isLiked;
      state.post.likeCount = Math.max(
        (state.post.likeCount || 0) + (state.post.isLiked ? 1 : -1),
        0
      );
    },

    // make this ONLY flip the flag to avoid double-counting with addCommentToFront
    toggleComment: (state) => {
      if (!state.post) return;
      state.post.isCommented = !state.post.isCommented;
    },

    addCommentToFront: (state, action) => {
      if (!state.post) return;
      const newComment = action.payload;
      if (!Array.isArray(state.post.comments)) {
        state.post.comments = [];
      }
      state.post.comments.unshift(newComment);
      state.post.commentCount = (state.post.commentCount || 0) + 1;
      state.post.isCommented = true;
    },

    toggleCommentLike: (state, action) => {
      const commentId = action.payload;
      if (!(state.post && Array.isArray(state.post.comments))) return;
      const idx = state.post.comments.findIndex(c => c._id === commentId);
      if (idx === -1) return;
      const comment = state.post.comments[idx];
      comment.isLiked = !comment.isLiked;
      comment.likes = Math.max((comment.likes || 0) + (comment.isLiked ? 1 : -1), 0);
    },
  },
});

export const {
  setSinglePost,
  clearSinglePost,
  updatePostLikes,
  updatePostComments,
  setSinglePostLoading,
  setSinglePostError,
  toggleLike,
  toggleComment,
  addCommentToFront,
  toggleCommentLike,
} = singlePostSlice.actions;

export default singlePostSlice.reducer;
