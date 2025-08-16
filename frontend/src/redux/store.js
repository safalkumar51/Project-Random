import { configureStore } from '@reduxjs/toolkit';
import requestsReducer from './slices/requestsSlice';
import connectionsReducer from './slices/connectionsSlice';
import feedReducer from './slices/feedSlice';
import singlePostReducer from './slices/singlePostSlice';
import singlePostCommentsReducer from './slices/singlePostCommentsSlice'; 
import myProfileReducer from './slices/myProfileSlice';
import myPostsReducer from './slices/myPostsSlice';
import otherProfileReducer from './slices/otherProfileSlice';
import messagesReducer from './slices/messagesSlice';
import chatsReducer from './slices/chatsSlice';

export const store = configureStore({
  reducer: {
    requests: requestsReducer,
    connections: connectionsReducer,
    feed: feedReducer,
    singlePost: singlePostReducer,
    singlePostComments: singlePostCommentsReducer,
    myProfile: myProfileReducer,
    myPosts: myPostsReducer,
    otherProfile: otherProfileReducer,
    messages: messagesReducer, 
    chats: chatsReducer,          
  },
});
