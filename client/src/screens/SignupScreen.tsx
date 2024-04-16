import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ToastAndroid, Image, Platform, StyleSheet } from 'react-native';
import ImagePicker, { ImageOrVideo } from 'react-native-image-crop-picker';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser, registerUser } from '../../redux/actions/userAction';

type Props = {
  navigation: any;
};

const SignupScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState('');
  const dispatch = useDispatch();
  const { error, isAuthenticated } = useSelector((state: any) => state.user);

  useEffect(() => {
    if (error) {
      if (Platform.OS === 'android') {
        ToastAndroid.show(error, ToastAndroid.LONG);
      } else {
        Alert.alert(error);
      }
    }
    if (isAuthenticated) {
      loadUser()(dispatch);
    }
  }, [error, isAuthenticated]);

  const uploadImage = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
      compressImageQuality: 0.8,
      includeBase64: true,
    }).then((image: ImageOrVideo | null) => {
      if (image) {
        setAvatar(`data:image/jpeg;base64,${image.data}`);
      }
    });
  };

  const submitHandler = () => {
    if (avatar === '' || name === '' || email === '') {
      if (Platform.OS === 'android') {
        ToastAndroid.show('Please fill all fields and upload an avatar', ToastAndroid.LONG);
      } else {
        Alert.alert('Please fill all fields and upload an avatar');
      }
    } else {
      registerUser(name, email, password, avatar)(dispatch);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.headerText}>Sign Up</Text>
        <TextInput
          placeholder="Enter your name"
          value={name}
          onChangeText={text => setName(text)}
          placeholderTextColor="#666"
          style={styles.input}
        />
        <TextInput
          placeholder="Enter your email"
          value={email}
          onChangeText={text => setEmail(text)}
          placeholderTextColor="#666"
          style={styles.input}
        />
        <TextInput
          placeholder="Enter your password"
          value={password}
          onChangeText={text => setPassword(text)}
          secureTextEntry
          placeholderTextColor="#666"
          style={styles.input}
        />
        <TouchableOpacity style={styles.uploadButton} onPress={uploadImage}>
          <Image
            source={{ uri: avatar ? avatar : 'https://cdn-icons-png.flaticon.com/128/568/568717.png' }}
            style={styles.avatar}
          />
          <Text style={styles.uploadText}>Upload Image</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.signupButton} onPress={submitHandler}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <Text style={styles.signupText} onPress={() => navigation.navigate('Login')}>
          Already have an account? <Text style={styles.linkText}>Sign in</Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D6E4FF', // Light turquoise background
  },
  formContainer: {
    width: '70%',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 25,
    fontWeight: '600',
    color: '#4B0082', // Dark purple header text
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#4B0082', // Dark purple border
    paddingHorizontal: 10,
    marginBottom: 20,
    color: '#000',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  uploadText: {
    color: '#4B0082', // Dark purple upload text
  },
  signupButton: {
    width: '100%',
    height: 40,
    backgroundColor: '#4B0082', // Dark purple button background
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  signupText: {
    color: '#000',
    textAlign: 'center',
  },
  linkText: {
    fontWeight: 'bold',
  },
});

export default SignupScreen;
