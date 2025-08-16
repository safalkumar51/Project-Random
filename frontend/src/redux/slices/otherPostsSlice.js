import { createSlice } from '@reduxjs/toolkit';
import { initialOtherPostsState, otherPostsAdapter } from '../adaptors/otherProfileAdapters';


const otherPostsSlice = createSlice({
    name: 'otherPosts',
    initialState: initialOtherPostsState,
    reducers: {
        setOtherPosts: otherPostsAdapter.setAll,
        addManyOtherPosts: otherPostsAdapter.addMany,
        clearOtherPosts: otherPostsAdapter.removeAll,
        toggleOtherPostsLike: (state, action) => {
            const post = state.entities[action.payload];
            if (post) {
                post.isLiked = !post.isLiked;
                post.likesCount += post.isLiked ? 1 : -1;
            }
        },
        toggleOtherPostsComment: (state, action) => {
            const post = state.entities[action.payload];
            if (post) {
                post.isCommented = true;
                post.commentsCount += 1;
            }
        },
    }
});

export const { setOtherPosts, addManyOtherPosts, clearOtherPosts, toggleOtherPostsLike, toggleOtherPostsComment } = otherPostsSlice.actions;
export default otherPostsSlice.reducer;