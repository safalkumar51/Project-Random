import { configureStore } from '@reduxjs/toolkit';
import requestsReducer from './slices/requestsSlice';
import connectionsReducer from './slices/connectionsSlice';
import feedReducer from './slices/feedSlice';
import singlePostReducer from './slices/singlePostSlice';
import myProfileReducer from './slices/myProfileSlice';
import otherProfileReducer from './slices/otherProfileSlice';
import messagesReducer from './slices/messagesSlice';
import chatReducer from './slices/chatSlice';

export const store = configureStore({
  reducer: {
    requests: requestsReducer,
    connections: connectionsReducer,
    feed: feedReducer,
    singlePost: singlePostReducer,
    myProfile: myProfileReducer,
    otherProfile: otherProfileReducer,
    messages: messagesReducer, 
    chat: chatReducer,          
  },
});
