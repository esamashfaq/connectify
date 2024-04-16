import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { getNotifications } from '../../redux/actions/notificationAction';
import { useDispatch, useSelector } from 'react-redux';
import getTimeDuration from '../common/TimeGenerator';
import axios from 'axios';
import { URI } from '../../redux/URI';
import Loader from '../common/Loader';

type Props = {
  navigation: any;
};

const NotificationScreen = ({ navigation }: Props) => {
  const dispatch = useDispatch();
  const { notifications, isLoading } = useSelector(
    (state: any) => state.notification,
  );
  const [refreshing, setRefreshing] = useState(false);
  const { posts } = useSelector((state: any) => state.post);
  const { token, users } = useSelector((state: any) => state.user);
  const [active, setActive] = useState(0);
  const refreshingHeight = 100;

  useEffect(() => {
    getNotifications()(dispatch);
  }, []);

  const handleTabPress = (index: number) => {
    setActive(index);
  };

  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <View style={styles.header}>
            <Text style={styles.headerText}>Activity</Text>
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[
                  styles.tabButton,
                  {
                    backgroundColor: active === 0 ? '#4B0082' : '#FFF',
                    borderWidth: active === 0 ? 1 : 0,
                  },
                ]}
                onPress={() => handleTabPress(0)}>
                <Text style={[styles.tabButtonText, { color: active === 0 ? '#FFF' : '#000' }]}>All</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Display appropriate content based on tab */}
          {notifications.length === 0 && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>You have no activity yet!</Text>
            </View>
          )}

          {/* Display notifications list */}
          <FlatList
            data={notifications}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => {
                  setRefreshing(true);
                  getNotifications()(dispatch).then(() => {
                    setRefreshing(false);
                  });
                }}
                progressViewOffset={refreshingHeight}
              />
            }
            renderItem={({ item }) => {
              const time = item.createdAt;
              const formattedDuration = getTimeDuration(time);

              const handleNavigation = async () => {
                const id = item.creator._id;
                try {
                  const res = await axios.get(`${URI}/get-user/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                  });

                  if (item.type === 'Follow') {
                    navigation.navigate('UserProfile', { item: res.data.user });
                  } else {
                    navigation.navigate('PostDetails', {
                      data: posts.find((i: any) => i._id === item.postId),
                    });
                  }
                } catch (error) {
                  console.error('Error fetching user data:', error);
                }
              };

              return (
                <TouchableOpacity onPress={handleNavigation} style={styles.notificationItem}>
                  <View style={styles.avatarContainer}>
                    <Image
                      source={{ uri: users.find((user: any) => user._id === item.creator._id)?.avatar.url }}
                      style={styles.avatar}
                    />
                    {item.type === 'Like' && (
                      <View style={[styles.notificationBadge, { backgroundColor: '#eb4545' }]}>
                        <Image
                          source={{
                            uri: 'https://cdn-icons-png.flaticon.com/512/2589/2589175.png',
                          }}
                          style={styles.badgeIcon}
                        />
                      </View>
                    )}
                    {item.type === 'Follow' && (
                      <View style={[styles.notificationBadge, { backgroundColor: '#5a49d6' }]}>
                        <Image
                          source={{
                            uri: 'https://cdn-icons-png.flaticon.com/512/1077/1077114.png',
                          }}
                          style={styles.badgeIcon}
                        />
                      </View>
                    )}
                  </View>
                  <View style={styles.notificationContent}>
                    <Text style={styles.notificationUserName}>{item.creator.name}</Text>
                    <Text style={styles.notificationTimestamp}>{formattedDuration}</Text>
                    <Text style={styles.notificationText}>{item.title}</Text>
                  </View>
                </TouchableOpacity>
              );
            }}
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
          />
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D6E4FF',
  },
  header: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#4B0082',
  },
  headerText: {
    fontSize: 25,
    fontWeight: '600',
    color: '#4B0082',
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  tabButton: {
    width: 105,
    height: 38,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabButtonText: {
    fontSize: 20,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#000',
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#0000003b',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  notificationBadge: {
    position: 'absolute',
    bottom: 5,
    right: -5,
    width: 25,
    height: 25,
    borderRadius: 12.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeIcon: {
    width: 15,
    height: 15,
    tintColor: '#fff',
  },
  notificationContent: {
    flex: 1,
    paddingLeft: 10,
  },
  notificationUserName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  notificationTimestamp: {
    fontSize: 16,
    color: '#000000b3',
    fontWeight: '600',
  },
  notificationText: {
    fontSize: 16,
    color: '#000000b3',
    fontWeight: '600',
  },
});

export default NotificationScreen;
