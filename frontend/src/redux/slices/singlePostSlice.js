import { createSlice } from '@reduxjs/toolkit';

import { postAdapter, initialPostState } from '../adaptors/singlePostAdapters';

const singlePostSlice = createSlice({
    name: 'singlePost',
    initialState: initialPostState,
    reducers: {
        setPost: postAdapter.setOne,
        updatePost: postAdapter.updateOne,
        removePost: postAdapter.removeOne,
        clearPost: postAdapter.removeAll,   
        toggleLike: (state, action) => {
            const post = state.entities[action.payload];
            if (post) {
                post.isLiked = !post.isLiked;
                post.likesCount += post.isLiked ? 1 : -1;
            }
        },
        toggleComment: (state, action) => {
            const post = state.entities[action.payload];
            if (post) {
                post.commentsCount += 1;
                post.myCommentsCount += 1;
                if (post.myCommentsCount) post.isCommented = true;
            }
        },
        untoggleComment: (state, action) => {
            const post = state.entities[action.payload];
            if (post) {
                post.commentsCount -= 1;
                post.myCommentsCount -= 1;
                if (!post.myCommentsCount) post.isCommented = false;
            }
        }
    }
});

export const { setPost, updatePost, removePost, clearPost, toggleLike, toggleComment, untoggleComment } = singlePostSlice.actions;
export default singlePostSlice.reducer;
