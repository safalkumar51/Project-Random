import { createSlice } from '@reduxjs/toolkit';
import { initialOtherPostsState, otherPostsAdapter } from '../adaptors/otherProfileAdapters';


const otherPostsSlice = createSlice({
    name: 'otherPosts',
    initialState: initialOtherPostsState,
    reducers: {
        setOtherPosts: otherPostsAdapter.setAll,
        addOtherPosts: otherPostsAdapter.addMany,
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
                post.commentsCount += 1;
                post.myCommentsCount +=1;
                if (post.myCommentsCount) post.isCommented = true;
            }
        },
        untoggleOtherPostsComment: (state, action) => {
            const post = state.entities[action.payload];
            if (post) {
                post.commentsCount -= 1;
                post.myCommentsCount -= 1;
                if (!post.myCommentsCount) post.isCommented = false;
            }
        }
    }
});

export const { setOtherPosts, addOtherPosts, clearOtherPosts, toggleOtherPostsLike, toggleOtherPostsComment, untoggleOtherPostsComment } = otherPostsSlice.actions;
export default otherPostsSlice.reducer;