import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, SafeAreaView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import ImagePicker from 'react-native-image-crop-picker';
import { createPostAction, getAllPosts } from '../../redux/actions/postAction';

type Props = {
  navigation: any;
};

const PostScreen = ({navigation}: Props) => {
  const {user} = useSelector((state: any) => state.user);
  const {isSuccess, isLoading} = useSelector((state: any) => state.post);
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const [replies, setReplies] = useState([{ title: '', image: '', user }]);

  useEffect(() => {
    if (isSuccess) {
      navigation.goBack();
      getAllPosts()(dispatch);
    }
  }, [isSuccess]);

  const handleTitleChange = (index: number, text: string) => {
    setReplies((prevPost) => {
      const updatedPost = [...prevPost];
      updatedPost[index] = { ...updatedPost[index], title: text };
      return updatedPost;
    });
  };

  const uploadImage = (index: number) => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
      compressImageQuality: 0.9,
      includeBase64: true,
    }).then((image) => {
      if (image) {
        setReplies((prevPost) => {
          const updatedPost = [...prevPost];
          updatedPost[index] = { ...updatedPost[index], image: 'data:image/jpeg;base64,' + image.data };
          return updatedPost;
        });
      }
    });
  };

  const addNewThread = () => {
    if (replies[replies.length - 1].title !== '' || replies[replies.length - 1].image !== '') {
      setReplies((prevPost) => [...prevPost, { title: '', image: '', user }]);
    }
  };

  const removeThread = (index: number) => {
    const updatedPost = [...replies];
    updatedPost.splice(index, 1);
    setReplies(updatedPost);
  };

  const postImageUpload = () => {
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

  const createPost = () => {
    if (title !== '' || (image !== '' && !isLoading)) {
      createPostAction(title, image, user, replies)(dispatch);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#D6E4FF' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', margin: 10 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2961/2961937.png' }}
            style={{ width: 20, height: 20 }}
          />
        </TouchableOpacity>
        <Text style={{ paddingLeft: 10, fontSize: 20, fontWeight: '500', color: '#4B0082' }}>New Post</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ margin: 10 }}>
          <View style={{ flexDirection: 'row', marginBottom: 10, alignItems: 'center' }}>
            <Image source={{ uri: user?.avatar.url }} style={{ width: 40, height: 40, borderRadius: 20 }} />
            <View style={{ paddingHorizontal: 10, flex: 1 }}>
              <Text style={{ fontSize: 16, color: '#000', fontWeight: 'bold' }}>{user?.name}</Text>
              <TextInput
                placeholder="Create A New Post..."
                placeholderTextColor="#666"
                value={title}
                onChangeText={(text) => setTitle(text)}
                style={{ marginTop: 5, fontSize: 16, color: '#000' }}
              />
              <TouchableOpacity style={{ marginTop: 5 }} onPress={postImageUpload}>
                <Image
                  source={{ uri: 'https://cdn-icons-png.flaticon.com/512/10857/10857463.png' }}
                  style={{ width: 20, height: 20, tintColor: '#4B0082' }}
                />
              </TouchableOpacity>
            </View>
          </View>

          {image !== '' && (
            <View style={{ marginTop: 10 }}>
              <Image source={{ uri: image }} style={{ width: 200, height: 300 }} resizeMode="cover" />
            </View>
          )}

          {replies.map((item, index) => (
            <View key={index} style={{ marginTop: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={{ uri: user?.avatar.url }} style={{ width: 40, height: 40, borderRadius: 20 }} />
                <View style={{ paddingHorizontal: 10, flex: 1 }}>
                  <Text style={{ fontSize: 16, color: '#000', fontWeight: 'bold' }}>{user?.name}</Text>
                  <TextInput
                    placeholder="Create A New Post..."
                    placeholderTextColor="#666"
                    value={item.title}
                    onChangeText={(text) => handleTitleChange(index, text)}
                    style={{ marginTop: 5, fontSize: 16, color: '#000' }}
                  />
                  <TouchableOpacity style={{ marginTop: 5 }} onPress={() => uploadImage(index)}>
                    <Image
                      source={{ uri: 'https://cdn-icons-png.flaticon.com/512/10857/10857463.png' }}
                      style={{ width: 20, height: 20, tintColor: '#4B0082' }}
                    />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => removeThread(index)}>
                  <Image
                    source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2961/2961937.png' }}
                    style={{ width: 20, height: 20 }}
                  />
                </TouchableOpacity>
              </View>
              {item.image !== '' && (
                <View style={{ marginTop: 10 }}>
                  <Image source={{ uri: item.image }} style={{ width: 200, height: 300 }} resizeMode="cover" />
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
        <Text style={{ color: '#000' }}>Anyone can reply</Text>
        <TouchableOpacity onPress={createPost}>
          <Text style={{ color: '#4B0082', fontWeight: 'bold' }}>Post</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default PostScreen;
