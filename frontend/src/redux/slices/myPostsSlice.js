import { createSlice } from '@reduxjs/toolkit';

import { myPostsAdapter,initialMyPostsState } from '../adaptors/myProfileAdapters';

const myPostsSlice = createSlice({
    name: 'myPosts',
    initialState: initialMyPostsState,
    reducers: {
        setMyPosts: myPostsAdapter.setAll,
        addMyPosts: myPostsAdapter.addMany,
        removeMyPost: myPostsAdapter.removeOne,
        clearMyPosts: myPostsAdapter.removeAll,
        toggleMyPostLike: (state, action) => {
            const post = state.entities[action.payload];
            if (post) {
                post.isLiked = !post.isLiked;
                post.likesCount += post.isLiked ? 1 : -1;
            }
        },
        toggleMyPostComment: (state, action) => {
            const post = state.entities[action.payload];
            if (post) {
                post.isCommented = true;
                post.commentsCount += 1;
            }
        },
    }
});

export const { setMyPosts, addMyPosts, removeMyPost, clearMyPosts, toggleMyPostLike, toggleMyPostComment } = myPostsSlice.actions;
export default myPostsSlice.reducer;