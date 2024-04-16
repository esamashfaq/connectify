import React, { useState } from 'react';
import { View, Text, SafeAreaView, Image, TextInput, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import ImagePicker, { ImageOrVideo } from 'react-native-image-crop-picker';
import axios from 'axios';
import { URI } from '../../redux/URI';
import { getAllPosts } from '../../redux/actions/postAction';
import getTimeDuration from '../common/TimeGenerator';
type Props = {
  navigation: any;
  route: any;
};
const CreateRepliesScreen = ({ navigation, route}: Props) => {
  const { item: post, postId } = route.params;
  const { user, token } = useSelector((state: any) => state.user);
  const [image, setImage] = useState('');
  const [title, setTitle] = useState('');
  const dispatch = useDispatch();

  const ImageUpload = async () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
      compressImageQuality: 0.8,
      includeBase64: true,
    }).then((image) => {
      if (image) {
        setImage('data:image/jpeg;base64,' + image.data);
      }
    });
  };

  const time = post.createdAt;
  const formattedDuration = getTimeDuration(time);

  const createReplies = async () => {
    try {
      if (!postId) {
        const res = await axios.put(
          `${URI}/add-replies`,
          {
            postId: post._id,
            title,
            image,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        getAllPosts()(dispatch);
        navigation.navigate('PostDetails', {
          data: res.data.post,
          navigation: navigation,
        });
      } else {
        const res = await axios.put(
          `${URI}/add-reply`,
          {
            postId,
            replyId: post._id,
            title,
            image,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        navigation.navigate('PostDetails', {
          data: res.data.post,
          navigation: navigation,
        });
      }
      setTitle('');
      setImage('');
    } catch (error) {
      console.error('Error creating reply:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/512/2961/2961937.png',
            }}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>Reply</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.postContainer}>
          <View style={styles.userInfo}>
            <Image
              source={{ uri: post.user.avatar.url }}
              style={styles.avatar}
            />
            <View style={styles.userInfoText}>
              <Text style={styles.userName}>{post.user.name}</Text>
              <Text style={styles.postTitle}>{post.title}</Text>
            </View>
          </View>
          {post.image && (
            <Image
              source={{ uri: post.image.url }}
              style={styles.postImage}
              resizeMode="contain"
            />
          )}
        </View>
        <View style={styles.replyContainer}>
          <Image
            source={{ uri: user.avatar.url }}
            style={styles.avatar}
          />
          <View style={styles.replyInputContainer}>
            <TextInput
              placeholder={`Reply to ${post.user.name}...`}
              placeholderTextColor="#666"
              style={styles.replyInput}
              value={title}
              onChangeText={setTitle}
            />
            <TouchableOpacity style={styles.uploadImageIcon} onPress={ImageUpload}>
              <Image
                source={{
                  uri: 'https://cdn-icons-png.flaticon.com/512/10857/10857463.png',
                }}
                style={styles.imageIcon}
              />
            </TouchableOpacity>
            {image ? (
              <Image
                source={{ uri: image }}
                style={styles.uploadedImage}
              />
            ) : null}
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.postButton} onPress={createReplies}>
        <Text style={styles.postButtonText}>Post</Text>
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
    borderBottomWidth: 1,
    borderBottomColor: '#00000029', 
  },
  backIcon: {
    width: 25,
    height: 25,
  },
  headerText: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 10,
    color: '#000', 
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 60,
  },
  postContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#00000029', 
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userInfoText: {
    marginLeft: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000', 
  },
  postTitle: {
    fontSize: 16,
    color: '#000', 
  },
  postImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 10,
    marginTop: 10,
  },
  replyContainer: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
  },
  replyInputContainer: {
    flex: 1,
    marginLeft: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#00000029',  
  },
  replyInput: {
    fontSize: 16,
    color: '#000', 
    minHeight: 40,
  },
  uploadImageIcon: {
    position: 'absolute',
    right: 5,
    bottom: 5,
  },
  imageIcon: {
    width: 20,
    height: 20,
  },
  uploadedImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 10,
    marginTop: 10,
  },
  postButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1977f2', 
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
  },
  postButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
  },
});

export default CreateRepliesScreen;
