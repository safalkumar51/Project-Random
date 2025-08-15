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
                post.isCommented = true;
                post.commentsCount += 1;
            }
        },
    },
});

export const { setFeedPosts, addFeedPost, addFeedPosts,removeFeedPost, clearFeedPosts, toggleFeedLike, toggleFeedComment } = feedSlice.actions;

export default feedSlice.reducer;
