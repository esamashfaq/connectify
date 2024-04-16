import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Image, FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { followUserAction, loadUser, unfollowUserAction } from '../../redux/actions/userAction';

type Props = {
  route: any;
  navigation: any;
};

const FollowerCard = ({ navigation, route }: Props) => {
  const followers = route.params.followers;
  const item = route.params.item;
  const following = route.params.following;
  const [data, setData] = useState(followers);
  const [active, setActive] = useState(0);
  const { user, users } = useSelector((state: any) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (users) {
      if (followers) {
        const updatedUsers = [...users, user];
        const fullUsers = updatedUsers.filter((user) =>
          followers.some((item: any) => item.userId === user._id)
        );
        setData(fullUsers);
      }
      if (active === 1) {
        if (following) {
          const updatedUsers = [...users, user];
          const fullUsers = updatedUsers.filter((user) =>
            following.some((item: any) => item.userId === user._id)
          );
          setData(fullUsers);
        }
      }
    }
  }, [followers, following, active, users]);

  const renderUserItem = ({ item }: any) => {
    const handleFollowUnfollow = async (userItem: any) => {
      try {
        const followUserId = userItem._id;
        if (userItem.followers.find((i:any) => i.userId === user._id)) {
          await unfollowUserAction({ userId: user._id, users, followUserId })(dispatch);
        } else {
          await followUserAction({ userId: user._id, users, followUserId })(dispatch);
        }
        loadUser()(dispatch);
      } catch (error) {
        console.log(error, 'error');
      }
    };

    return (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginVertical: 10,
          marginHorizontal: 20,
          paddingHorizontal: 10,
          paddingVertical: 15,
          backgroundColor: '#FFFFFF',
          borderRadius: 8,
          elevation: 3, // Add elevation for a card-like effect
        }}
        onPress={() => navigation.navigate('UserProfile', { item })}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={{ uri: item?.avatar?.url }}
            style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }}
          />
          <View>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#4B0082', marginBottom: 5 }}>
              {item?.name}
            </Text>
            <Text style={{ fontSize: 14, color: '#4B0082' }}>{item?.userName}</Text>
          </View>
        </View>
        {user._id !== item._id && (
          <TouchableOpacity
            style={{
              paddingVertical: 8,
              paddingHorizontal: 12,
              backgroundColor: '#4B0082',
              borderRadius: 20,
            }}
            onPress={() => handleFollowUnfollow(item)}
          >
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#FFFFFF' }}>
              {item?.followers?.find((i:any) => i.userId === user._id) ? 'Following' : 'Follow'}
            </Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#D6E4FF' }}>
      <View style={{ padding: 20 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/512/2961/2961937.png',
            }}
            style={{ width: 25, height: 25 }}
          />
        </TouchableOpacity>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#4B0082', marginTop: 10 }}>
          {item?.name}
        </Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 }}>
        <TouchableOpacity onPress={() => setActive(0)}>
          <Text style={{ fontSize: 18, color: '#4B0082', opacity: active === 0 ? 1 : 0.6 }}>Followers</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActive(1)}>
          <Text style={{ fontSize: 18, color: '#4B0082', opacity: active === 1 ? 1 : 0.6 }}>Following</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActive(2)}>
          <Text style={{ fontSize: 18, color: '#4B0082', opacity: active === 2 ? 1 : 0.6 }}>Pending</Text>
        </TouchableOpacity>
      </View>
      <View style={{ height: 1, backgroundColor: '#4B0082', marginBottom: 10 }} />
      {active === 0 && (
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#4B0082', textAlign: 'center', marginBottom: 10 }}>
          {followers?.length} followers
        </Text>
      )}
      {active === 1 && (
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#4B0082', textAlign: 'center', marginBottom: 10 }}>
          {following?.length} following
        </Text>
      )}
      <FlatList
        data={data}
        renderItem={renderUserItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
      {active === 2 && (
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#4B0082', textAlign: 'center', marginTop: 20 }}>
          No Pending
        </Text>
      )}
    </SafeAreaView>
  );
};

export default FollowerCard;
