import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  followUserAction,
  unfollowUserAction,
} from '../../redux/actions/userAction';
import PostCard from '../components/PostCard';

type Props = {
  route: any;
  navigation: any;
};

const UserProfileScreen = ({ navigation, route }: Props) => {
  const { users, user, isLoading } = useSelector((state: any) => state.user);
  const [imagePreview, setImagePreview] = useState(false);
  const [active, setActive] = useState(0);
  const { posts } = useSelector((state: any) => state.post);
  const [postData, setPostsData] = useState([]);
  const [repliesData, setRepliesData] = useState([]);
  const d = route.params.item;
  const [data, setData] = useState(d);
  const dispatch = useDispatch();

  useEffect(() => {
    if (users && d) {
      const userData = users.find((i: any) => i._id === d?._id);
      setData(userData);
    }
    if (posts && d) {
      const myPosts = posts.filter((post: any) =>
        post.replies && // Check if replies array exists
        post.replies.some((reply: any) =>
          reply.user && // Check if user object exists in reply
          reply.user._id === d._id
        )
      );
      setRepliesData(myPosts.filter((post: any) => post.replies && post.replies.length > 0));

      const myUserPosts = posts.filter((post: any) => post.user._id === d._id);
      setPostsData(myUserPosts);
    }
  }, [users, route.params.item, posts, d]);


  const FollowUnfollowHandler = async () => {
    try {
      if (data.followers.find((i: any) => i.userId === user._id)) {
        await unfollowUserAction({
          userId: user._id,
          users,
          followUserId: data._id,
        })(dispatch);
      } else {
        await followUserAction({
          userId: user._id,
          users,
          followUserId: data._id,
        })(dispatch);
      }
    } catch (error) {
      console.log(error, 'error');
    }
  };

  return (
    <>
      {data && (
        <SafeAreaView style={styles.container}>
          {imagePreview ? (
            <TouchableOpacity
              style={styles.imagePreview}
              onPress={() => setImagePreview(!imagePreview)}>
              <Image
                source={{ uri: data.avatar.url }}
                style={styles.avatarImage}
              />
            </TouchableOpacity>
          ) : (
            <View style={styles.content}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Image
                  source={{
                    uri: 'https://cdn-icons-png.flaticon.com/512/2223/2223615.png',
                  }}
                  style={styles.backButton}
                />
              </TouchableOpacity>
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.userInfo}>
                  <Image source={{ uri: data.avatar.url }} style={styles.avatar} />
                  <View>
                    <Text style={styles.userName}>{data.name}</Text>
                    {data.userName && (
                      <Text style={styles.userDetails}>{data.userName}</Text>
                    )}
                    {data.bio && (
                      <Text style={styles.userDetails}>{data.bio}</Text>
                    )}
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('FollowerCard', {
                          item: data,
                          followers: data?.followers,
                          following: data?.following,
                        })
                      }>
                      <Text style={styles.followersText}>
                        {data.followers.length} followers
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.followButton}
                  onPress={FollowUnfollowHandler}>
                  <Text style={styles.followButtonText}>
                    {data.followers.find((i: any) => i.userId === user._id)
                      ? 'Following'
                      : 'Follow'}
                  </Text>
                </TouchableOpacity>
                <View style={styles.tabBar}>
                  <TouchableOpacity
                    onPress={() => setActive(0)}
                    style={[
                      styles.tabItem,
                      { opacity: active === 0 ? 1 : 0.6 },
                    ]}>
                    <Text style={styles.tabText}>Posts</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setActive(1)}
                    style={[
                      styles.tabItem,
                      { opacity: active === 1 ? 1 : 0.6 },
                    ]}>
                    <Text style={styles.tabText}>Replies</Text>
                  </TouchableOpacity>
                </View>
                {active === 0 ? (
                  <>
                    {postData &&
                      postData.map((item: any) => (
                        <PostCard
                          navigation={navigation}
                          key={item._id}
                          item={item}
                        />
                      ))}
                    {postData.length === 0 && (
                      <Text style={styles.noPostsText}>No Posts yet!</Text>
                    )}
                  </>
                ) : (
                  <>
                    {repliesData &&
                      repliesData.map((item: any) => (
                        <PostCard
                          navigation={navigation}
                          key={item._id}
                          item={item}
                          replies={true}
                        />
                      ))}
                    {active !== 1 && postData.length === 0 && (
                      <Text style={styles.noPostsText}>No Posts yet!</Text>
                    )}
                  </>
                )}
              </ScrollView>
            </View>
          )}
        </SafeAreaView>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D6E4FF', // Light turquoise background
  },
  imagePreview: {
    alignItems: 'center',
  },
  avatarImage: {
    width: 250,
    height: 250,
    borderRadius: 500,
  },
  content: {
    padding: 12,
  },
  backButton: {
    height: 25,
    width: 25,
  },
  userInfo: {
    flexDirection: 'row',
    width: '100%',
    paddingBottom: 10,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  userName: {
    paddingTop: 10,
    fontSize: 22,
    color: 'black',
  },
  userDetails: {
    paddingTop: 5,
    fontSize: 16,
    color: '#0000009d',
  },
  followersText: {
    paddingTop: 10,
    fontSize: 18,
    color: '#000000c7',
  },
  followButton: {
    marginTop: 10,
    borderRadius: 8,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 38,
    backgroundColor: 'black',
  },
  followButtonText: {
    fontSize: 18,
    color: 'white',
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#00000032',
    position: 'relative',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 5,
  },
  tabText: {
    fontSize: 18,
    color: 'black',
  },
  noPostsText: {
    paddingVertical: 10,
    textAlign: 'center',
    fontSize: 18,
    color: 'black',
  },
});

export default UserProfileScreen;
