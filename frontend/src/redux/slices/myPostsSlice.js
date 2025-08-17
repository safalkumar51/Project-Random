import { createSlice } from '@reduxjs/toolkit';

import { myPostsAdapter,initialMyPostsState } from '../adaptors/myProfileAdapters';

const myPostsSlice = createSlice({
    name: 'myPosts',
    initialState: initialMyPostsState,
    reducers: {
        setMyPosts: myPostsAdapter.setAll,
        addMyPosts: myPostsAdapter.addMany,
        addMyPost: myPostsAdapter.addOne,
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
                post.commentsCount += 1;
                post.myCommentsCount += 1;
                if (post.myCommentsCount) post.isCommented = true;
            }
        },
        untoggleMyPostsComment: (state, action) => {
            const post = state.entities[action.payload];
            if (post) {
                post.commentsCount -= 1;
                post.myCommentsCount -= 1;
                if (!post.myCommentsCount) post.isCommented = false;
            }
        }
    }
});

export const { setMyPosts, addMyPosts, addMyPost, removeMyPost, clearMyPosts, toggleMyPostLike, toggleMyPostComment, untoggleMyPostsComment } = myPostsSlice.actions;
export default myPostsSlice.reducer;