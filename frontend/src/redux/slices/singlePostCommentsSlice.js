import { createSlice } from '@reduxjs/toolkit';
import { commentsAdapter, initialCommentsState } from '../adaptors/singlePostAdapters';

const singlePostCommentsSlice = createSlice({
    name: 'singlePostComments',
    initialState: initialCommentsState,
    reducers: {
        setComments: commentsAdapter.setAll,
        addComment: commentsAdapter.addOne,
        addManyComment: commentsAdapter.addMany,
        removeComment: commentsAdapter.removeOne,
        clearComments: commentsAdapter.removeAll,
        toggleCommentLike: (state, action) => {
            const comment = state.entities[action.payload];
            if (comment) {
                comment.isCommentLiked = !comment.isCommentLiked;
                comment.commentLikesCount += comment.isCommentLiked ? 1 : -1;
            }
        }
    }
});

export const { setComments, addComment, addManyComment, clearComments, toggleCommentLike } = singlePostCommentsSlice.actions;
export default singlePostCommentsSlice.reducer;