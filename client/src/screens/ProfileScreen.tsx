import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dimensions } from 'react-native';
import { loadUser, logoutUser } from '../../redux/actions/userAction';
import PostCard from '../components/PostCard';
type Props = {
  navigation: any;
};

const { width } = Dimensions.get('window');

const ProfileScreen = ({ navigation }: Props) => {
  const [active, setActive] = useState(0);
  const { user } = useSelector((state: any) => state.user);
  const { posts, isLoading } = useSelector((state: any) => state.post);
  const [data, setData] = useState([]);
  const [repliesData, setRepliesData] = useState([]);
  const [refreshing, setRefreshing] = useState(false); // State for RefreshControl
  const dispatch = useDispatch();
  const [refreshKey, setRefreshKey] = useState(0); // Key for forcing re-render

  const logoutHandler = async () => {
    logoutUser()(dispatch);
  };

  useEffect(() => {
    if (posts && user) {
      const myPosts = posts.filter((post: any) => post.user._id === user._id);
      setData(myPosts);
    }
  }, [posts, user]);

  useEffect(() => {
    if (posts && user) {
      const myReplies = posts.filter(
        (post: any) =>
          post.replies && // Check if replies array exists
          post.replies.some((reply: any) => reply.user && reply.user._id === user._id)
      );
      setRepliesData(
        myReplies.filter((post: any) => post.replies && post.replies.length > 0)
      );
    }
  }, [posts, user]);

  const onRefresh = () => {
    setRefreshing(true);
    // Dispatch action to refresh user data or any other necessary data
    // For example, you might dispatch loadUser()(dispatch) here
    // Once the refresh operation is complete, set refreshing to false
    setTimeout(() => {
      setRefreshing(false);
      // Update the key to force re-render
      setRefreshKey(refreshKey + 1);
    }, 2000); // Simulating a delay of 2 seconds for demonstration
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      key={refreshKey} // Add key prop to force re-render
    >
     <SafeAreaView style={styles.container}>
        <View>
          <View style={styles.header}>
            <View>
              <Text style={styles.name}>{user?.name}</Text>
              <Text style={styles.username}>{user?.userName}</Text>
            </View>
            <View style={styles.avatarContainer}>
              <Image source={{ uri: user?.avatar.url }} style={styles.avatar} />
              {user.role === 'Admin' && (
                <Image
                  source={{ uri: 'https://cdn-icons-png.flaticon.com/128/1828/1828640.png' }}
                  style={styles.adminBadge}
                />
              )}
            </View>
          </View>
          <Text style={styles.bio}>{user?.bio}</Text>
          <View style={styles.followersContainer}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('FollowerCard', {
                  followers: user?.followers,
                  following: user?.following,
                })
              }
            >
              <Text style={styles.followers}>{user?.followers.length} followers</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('EditProfile')}>
              <Text style={styles.buttonText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={logoutHandler}>
              <Text style={styles.buttonText}>Log Out</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.tabContainer}>
            <TouchableOpacity style={styles.tabItem} onPress={() => setActive(0)}>
              <Text style={[styles.tabText, active === 0 && styles.activeTab]}>Posts</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tabItem} onPress={() => setActive(1)}>
              <Text style={[styles.tabText, active === 1 && styles.activeTab]}>Replies</Text>
            </TouchableOpacity>
          </View>
        </View>

        {active === 0 && (
          <>
            {data &&
              data.map((item) => (
                <PostCard navigation={navigation} key={item._id} item={item} />
              ))}
            {data.length === 0 && (
              <Text style={styles.noContentText}>You have no posts yet!</Text>
            )}
          </>
        )}

        {active === 1 && (
          <>
            {repliesData &&
              repliesData.map((item) => (
                <PostCard navigation={navigation} key={item._id} item={item} replies={true} />
              ))}
            {repliesData.length === 0 && (
              <Text style={styles.noContentText}>You have no replies yet!</Text>
            )}
          </>
        )}
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D6E4FF',
    padding: 10,
    flexGrow: 1, // Ensure the container fills the available space
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: width - 20,
    padding: 10,
  },
  name: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#4B0082',
  },
  username: {
    fontSize: 20,
    color: '#4B0082',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  adminBadge: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 18,
    height: 18,
  },
  bio: {
    color: '#000000d4',
    fontSize: 18,
    lineHeight: 24,
    marginBottom: 10,
  },
  followersContainer: {
    padding: 10,
  },
  followers: {
    fontSize: 16,
    color: '#444',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  button: {
    width: '48%',
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#4B0082',
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: '#4B0082',
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#00000032',
    marginBottom: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  tabText: {
    fontSize: 18,
    color: '#000',
    opacity: 0.6,
  },
  activeTab: {
    opacity: 1,
  },
  noContentText: {
    color: '#000',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
});
export default ProfileScreen;
