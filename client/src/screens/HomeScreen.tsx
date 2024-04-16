import React, { useEffect, useRef, useState } from 'react';
import { View, FlatList, Animated, Easing, RefreshControl, Platform, SafeAreaView, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPosts } from '../../redux/actions/postAction';
import { getAllUsers } from '../../redux/actions/userAction';
import PostCard from '../components/PostCard';
import Loader from '../common/Loader';
import LottieView from 'lottie-react-native';

type Props = {
  navigation: any; 
};

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useDispatch();
  const { posts, isLoading } = useSelector((state: any) => state.post);
  const [offsetY, setOffsetY] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const extraPaddingTop = useRef(new Animated.Value(0)).current;

  const refreshingHeight = 100;

  const lottieViewRef = useRef<LottieView>(null);

  const onScroll = (event: any) => {
    const { contentOffset } = event.nativeEvent;
    const { y } = contentOffset;
    setOffsetY(y);
  };

  const onRelease = () => {
    if (offsetY <= -refreshingHeight && !isRefreshing) {
      setIsRefreshing(true);
      setTimeout(() => {
        getAllPosts()(dispatch);
        setIsRefreshing(false);
      }, 3000);
    }
  };

  const onScrollEndDrag = (event: any) => {
    const { contentOffset } = event.nativeEvent;
    const { y } = contentOffset;
    setOffsetY(y);

    if (y <= -refreshingHeight && !isRefreshing) {
      setIsRefreshing(true);
      setTimeout(() => {
        getAllPosts()(dispatch);
        setIsRefreshing(false);
      }, 3000);
    }
  };

  useEffect(() => {
    getAllPosts()(dispatch);
    getAllUsers()(dispatch);
  }, [dispatch]);

  useEffect(() => {
    if (isRefreshing) {
      Animated.timing(extraPaddingTop, {
        toValue: refreshingHeight,
        duration: 0,
        useNativeDriver: false,
      }).start();
      lottieViewRef.current?.play();
    } else {
      Animated.timing(extraPaddingTop, {
        toValue: 0,
        duration: 400,
        easing: Easing.elastic(1.3),
        useNativeDriver: false,
      }).start();
    }
  }, [isRefreshing]);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <SafeAreaView style={styles.container}>
          <FlatList
            data={posts}
            renderItem={({ item }) => <PostCard navigation={navigation} item={item} />}
            showsVerticalScrollIndicator={false}
            onScroll={onScroll}
            onScrollEndDrag={onScrollEndDrag}
            onResponderRelease={onRelease}
            ListHeaderComponent={<Animated.View style={{ paddingTop: extraPaddingTop }} />}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={() => {
                  setIsRefreshing(true);
                  getAllPosts()(dispatch).then(() => setIsRefreshing(false));
                }}
                progressViewOffset={refreshingHeight}
                colors={['#4B0082']}
              />
            }
          />
          {isRefreshing && (
            <LottieView
              ref={lottieViewRef}
              style={styles.refreshIndicator}
              loop={false}
              source={require('../assets/animation_lkbqh8co.json')}
              progress={offsetY < 0 ? Math.min(offsetY / -refreshingHeight, 1) : 0}
            />
          )}
        </SafeAreaView>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D6E4FF', 
  },
  refreshIndicator: {
    height: 100,
    position: 'absolute',
    top: 15,
    left: 0,
    right: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HomeScreen;
