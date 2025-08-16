import React, { useCallback, useEffect, useMemo } from 'react';
import { FlatList, Animated, ActivityIndicator } from 'react-native';
import { useSelector, shallowEqual } from 'react-redux';
import { selectCommentIds } from '../redux/selectors/singlePostSelectors';
import CommentCard from '../components/CommentCard';
import PostCards from '../components/PostCards';


const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const SinglePostList = React.memo(({
    postId,
    onScroll,
    onEndReached,
    loading,
    postLoading
}) => {
    // Only select the comment IDs for this post
    const commentIds = useSelector(selectCommentIds, shallowEqual);

    const data = useMemo(() => commentIds, [commentIds]);

    const listHeader = useMemo(() => {
        if (!postId || postLoading.current) {
            return <ActivityIndicator size="large" />;
        }

        return (
            <>
                <PostCards
                    postId={postId}
                    counter={1}
                />
            </>
        );
    }, [postId, postLoading.current]);

    const keyExtractor = useCallback((item) => (item._id ? item._id : item), []);
    const renderItem = useCallback(({ item }) => <CommentCard commentId={item} />, []);

    return (
        <AnimatedFlatList
            data={data}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            onScroll={onScroll}
            scrollEventThrottle={16}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.5}
            ListHeaderComponent={listHeader}
            contentContainerStyle={{ paddingTop: 60, paddingBottom: 80 }}
            ListFooterComponent={loading.current && !postLoading.current && <ActivityIndicator />}
            showsVerticalScrollIndicator={false}
        />
    );
});

export default React.memo(SinglePostList);
