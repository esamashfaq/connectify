import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React, { useState } from 'react';
import { Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { TextInput } from 'react-native';
import ImagePicker, { ImageOrVideo } from 'react-native-image-crop-picker';
import axios from 'axios';
import { URI } from '../../redux/URI';
import { loadUser } from '../../redux/actions/userAction';

type Props = {
  navigation: any;
};

const EditProfile = ({ navigation }: Props) => {
  const { user, token } = useSelector((state: any) => state.user);
  const [avatar, setAvatar] = useState(user?.avatar?.url);
  const dispatch = useDispatch();
  const [userData, setUserData] = useState({
    name: user.name,
    userName: user?.userName,
    bio: user?.bio,
  });

  const handleSubmitHandler = async () => {
    if (userData.name.length !== 0 && userData.userName.length !== 0) {
      await axios.put(
        `${URI}/update-profile`,
        {
          name: userData.name,
          userName: userData.userName,
          bio: userData.bio,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ).then((res: any) => {
        loadUser()(dispatch);
      });
    }
  };

  const ImageUpload = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
      compressImageQuality: 0.8,
      includeBase64: true,
    }).then((image: ImageOrVideo | null) => {
      if (image) {
        axios
          .put(
            `${URI}/update-avatar`,
            {
              avatar: 'data:image/jpeg;base64,' + image?<div className="data"></div>:null,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((res: any) => {
            loadUser()(dispatch);
          });
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/512/2961/2961937.png',
            }}
            style={styles.backButton}
          />
        </TouchableOpacity>
        <Text style={styles.title}>Edit Profile</Text>
      </View>
      <View style={styles.profileContainer}>
        <View style={styles.avatarContainer}>
          <TouchableOpacity onPress={ImageUpload}>
            <Image
              source={{ uri: avatar }}
              style={styles.avatar}
            />
          </TouchableOpacity>
        </View>
        <TextInput
          value={userData.name}
          onChangeText={e => setUserData({ ...userData, name: e })}
          placeholder="Enter your name..."
          placeholderTextColor="#000"
          style={styles.input}
        />
        <TextInput
          value={userData.userName}
          onChangeText={e => setUserData({ ...userData, userName: e })}
          placeholder="Enter your username..."
          placeholderTextColor="#000"
          style={styles.input}
        />
        <TextInput
          value={userData.bio}
          onChangeText={e => setUserData({ ...userData, bio: e })}
          placeholder="Enter your bio..."
          placeholderTextColor="#000"
          multiline
          numberOfLines={4}
          style={[styles.input, styles.bioInput]}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSubmitHandler}>
        <Text style={styles.buttonText}>Done</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D6E4FF',
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 25,
    height: 25,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 10,
    color: '#000',
  },
  profileContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  avatarContainer: {
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  input: {
    fontSize: 16,
    width: '90%',
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: '#0000002e',
    borderRadius: 10,
    backgroundColor: '#FFF',
  },
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#4B0082',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#D6E4FF',
  },
});

export default EditProfile;
