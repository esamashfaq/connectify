import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, Image, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { followUserAction, getAllUsers, unfollowUserAction } from '../../redux/actions/userAction';
import Loader from '../common/Loader';

type Props = {
  navigation: any;
};

const SearchScreen = ({navigation}: Props) => {
  const [data, setData] = useState([
    {
      name: '',
      userName: '',
      avatar: {url: ''},
      followers: [],
    },
  ]);
  const { users, user, isLoading } = useSelector((state: any) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    getAllUsers()(dispatch);
  }, [dispatch]);

  useEffect(() => {
    setData(users);
  }, [users]);

  const handleSearchChange = (text: any) => {
    const filteredUsers = users.filter((user: any) =>
      user.name.toLowerCase().includes(text.toLowerCase())
    );
    setData(filteredUsers);
  };

  const handleFollowUnfollow = async (item: any) => {
    try {
      if (item.followers.find((follower: any) => follower.userId === user._id)) {
        await unfollowUserAction({
          userId: user._id,
          users,
          followUserId: item._id,
        })(dispatch);
      } else {
        await followUserAction({
          userId: user._id,
          users,
          followUserId: item._id,
        })(dispatch);
      }
    } catch (error) {
      console.log(error, 'error');
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Search</Text>
            <View style={styles.searchContainer}>
              <Image
                source={{
                  uri: 'https://cdn-icons-png.flaticon.com/512/2811/2811806.png',
                }}
                style={styles.searchIcon}
              />
              <TextInput
                onChangeText={handleSearchChange}
                placeholder="Search"
                placeholderTextColor="#666"
                style={styles.searchInput}
              />
            </View>
          </View>
          <FlatList
            data={data}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('UserProfile', {
                    item: item,
                  })
                }
              >
                <View style={styles.userContainer}>
                  <Image
                    source={{ uri: item?.avatar?.url }}
                    style={styles.avatar}
                  />
                  <View style={styles.userInfo}>
                    <View style={styles.nameContainer}>
                      <Text style={styles.name}>{item.name}</Text>
                      {item.role === 'Admin' && (
                        <Image
                          source={{
                            uri: 'https://cdn-icons-png.flaticon.com/128/1828/1828640.png',
                          }}
                          style={styles.adminIcon}
                        />
                      )}
                    </View>
                    <Text style={styles.userName}>{item.userName}</Text>
                    <Text style={styles.followers}>{item.followers.length} followers</Text>
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.followButton,
                      {
                        backgroundColor: item.followers.find(
                          (follower: any) => follower.userId === user._id
                        )
                          ? '#4B0082' // Purple background color if following
                          : '#D6E4FF', // Turquoise background color if not following
                      },
                    ]}
                    onPress={() => handleFollowUnfollow(item)}
                  >
                    <Text style={[
                      styles.followButtonText,
                      {
                        color: item.followers.find((follower: any) => follower.userId === user._id)
                          ? '#D6E4FF' // Turquoise text color if following
                          : '#4B0082', // Purple text color if not following
                      },
                    ]}>
                      {item.followers.find((follower: any) => follower.userId === user._id)
                        ? 'Following'
                        : 'Follow'
                      }
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item: any) => item._id}
          />
        </SafeAreaView>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D6E4FF',
    padding: 15,
  },
  header: {
    marginBottom: 20,
  },
  headerText: {
    fontSize: 25,
    fontWeight: '600',
    color: '#4B0082',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  searchIcon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#000',
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: 18,
    color: '#000',
  },
  adminIcon: {
    width: 18,
    height: 18,
    marginLeft: 5,
  },
  userName: {
    fontSize: 18,
    color: '#000',
  },
  followers: {
    fontSize: 16,
    color: '#444',
    marginTop: 1,
  },
  followButton: {
    borderRadius: 8,
    width: 100,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4B0082',
  },
  followButtonText: {
    color: '#4B0082',
  },
});

export default SearchScreen;
