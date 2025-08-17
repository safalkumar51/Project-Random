import { createSlice } from '@reduxjs/toolkit';

import { feedAdapter, initialFeedState } from '../adaptors/feedAdapters';

const feedSlice = createSlice({
    name: 'feed',
    initialState: initialFeedState,
    reducers: {
        setFeedPosts: feedAdapter.setAll,
        addFeedPost: feedAdapter.addOne,
        addFeedPosts: feedAdapter.addMany,
        removeFeedPost: feedAdapter.removeOne,
        clearFeedPosts: feedAdapter.removeAll,
        toggleFeedLike: (state, action) => {
            const post = state.entities[action.payload];
            if (post) {
                post.isLiked = !post.isLiked;
                post.likesCount += post.isLiked ? 1 : -1;
            }
        },
        toggleFeedComment: (state, action) => {
            const post = state.entities[action.payload];
            if (post) {
                post.commentsCount += 1;
                post.myCommentsCount += 1;
                if (post.myCommentsCount) post.isCommented = true;
            }
        },
        untoggleFeedComment: (state, action) => {
            const post = state.entities[action.payload];
            if (post) {
                post.commentsCount -= 1;
                post.myCommentsCount -= 1;
                if (!post.myCommentsCount) post.isCommented = false;
            }
        }
    },
});

export const { setFeedPosts, addFeedPost, addFeedPosts,removeFeedPost, clearFeedPosts, toggleFeedLike, toggleFeedComment, untoggleFeedComment } = feedSlice.actions;

export default feedSlice.reducer;
