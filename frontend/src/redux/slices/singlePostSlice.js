import { createSlice } from '@reduxjs/toolkit';
import { useState } from 'react';

const initialState = {
    post: { comments: [] },
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
                state.post.comments.forEach(c => {
                    state.post.comments.push(c);
                });
            }
        },
        clearSinglePost: (state) => {
            state.post = { comments: [] };
        },
        
        // like toggle (use same pattern as list slices)
        toggleLike: (state, action) => {
            const postId = action.payload;
            if (!state.post || state.post._id !== postId) return;
            
            const wasLiked = state.post.isLiked;
            state.post.isLiked = !wasLiked;
            state.post.likesCount = (state.post.likesCount || 0) + (wasLiked ? -1 : 1);
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
