import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    post: { comments: [] },
    loading: false,
    error: null,
};

const singlePostSlice = createSlice({
    name: 'singlePost',
    initialState,
    reducers: {
        setSinglePost: (state, action) => {
            const { page, post } = action.payload;
            if (page === 1) {
                state.post = post;
            } else {
                state.post.comments = [...state.post.comments, ...post.comments];
            }
        },
        clearSinglePost: (state) => {
            state.post = { comments: [] };
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

        addComment: (state, action) => {
            const newComment = action.payload;
            if (!Array.isArray(state.post?.comments)) return;
            state.post.comments.unshift(newComment);
            state.post.commentsCount = (state.post.commentsCount || 0) + 1;
            state.post.isCommented = true;
        },

        toggleCommentLike: (state, action) => {
            const commentId = action.payload;
            if (!Array.isArray(state.post?.comments)) return;

            const comment = state.post.comments.find(c => c._id === commentId);

            if (comment) {
                const wasLiked = comment.isCommentLiked;
                comment.isCommentLiked = !wasLiked;
                comment.commentLikesCount = (comment.commentLikesCount || 0) + (wasLiked ? -1 : 1);
            }
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
    addComment,
    toggleCommentLike,
} = singlePostSlice.actions;

export default singlePostSlice.reducer;
