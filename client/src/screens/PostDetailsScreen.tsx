import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import PostDetailsCard from '../components/PostDetailsCard';

type Props = {
  navigation: any;
  route: any;
};

const PostDetailsScreen = ({navigation, route}: Props) => {
  const item = route.params.data;
  const { posts } = useSelector((state: any) => state.post);
  const [data, setData] = useState(item);

  useEffect(() => {
    if (posts) {
      const foundPost = posts.find((post: any) => post._id === item._id);
      setData(foundPost);
    }
  }, [posts]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2223/2223615.png' }}
            style={styles.backIcon}
          />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
        <PostDetailsCard navigation={navigation} item={data} postId={data._id} />
        <View style={styles.repliesContainer}>
          {data?.replies?.map((reply: any, index: number) => (
            <PostDetailsCard
              key={index}
              navigation={navigation}
              item={reply}
              isReply={true}
              postId={item._id}
            />
          ))}
        </View>
      </ScrollView>
      <TouchableOpacity
        style={styles.replyButton}
        onPress={() =>
          navigation.replace('CreateReplies', {
            item: item,
            navigation: navigation,
          })
        }>
        <Image
          source={{ uri: item.user.avatar.url }}
          style={styles.avatar}
        />
        <Text style={styles.replyText}>Reply to {item.user.name}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D6E4FF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  backIcon: {
    width: 25,
    height: 25,
  },
  scrollViewContent: {
    paddingBottom: 120,
  },
  repliesContainer: {
    padding: 10,
  },
  replyButton: {
    position: 'absolute',
    bottom: 20,
    left: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#00000029',
    paddingHorizontal: 10,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  replyText: {
    fontSize: 16,
    color: '#000',
  },
});

export default PostDetailsScreen;