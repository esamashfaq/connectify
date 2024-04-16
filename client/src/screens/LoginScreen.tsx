import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ToastAndroid, Platform, StyleSheet } from 'react-native';
import { loadUser, loginUser } from '../../redux/actions/userAction';
import { useDispatch, useSelector } from 'react-redux';

type Props = {
  navigation: any;
};

const LoginScreen = ({ navigation }: Props) => {
  const { error, isAuthenticated } = useSelector((state: any) => state.user);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const submitHandler = () => {
    loginUser(email, password)(dispatch);
  };

  useEffect(() => {
    if (error) {
      if (Platform.OS === 'android') {
        ToastAndroid.show('Email and password not matching!', ToastAndroid.LONG);
      } else {
        Alert.alert('Email and password not matching!');
      }
    }
    if (isAuthenticated) {
      loadUser()(dispatch);
      if (Platform.OS === 'android') {
        ToastAndroid.show('Login successful!', ToastAndroid.LONG);
      } else {
        Alert.alert('Login successful!');
      }
    }
  }, [isAuthenticated, error]);

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.headerText}>Login</Text>
        <TextInput
          placeholder="Enter your email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={styles.input}
          placeholderTextColor="#666"
        />
        <TextInput
          placeholder="Enter your password"
          value={password}
          onChangeText={(text) => setPassword(text)}
          style={styles.input}
          placeholderTextColor="#666"
          secureTextEntry
        />
        <TouchableOpacity style={styles.loginButton} onPress={submitHandler}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <Text style={styles.signupText} onPress={() => navigation.navigate('Signup')}>
          Don't have an account? <Text style={{ fontWeight: 'bold' }}>Sign up</Text>
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
    borderColor: '#4B0082', // Dark purple border for inputs
    paddingHorizontal: 10,
    marginBottom: 15,
    color: '#000',
  },
  loginButton: {
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
});

export default LoginScreen;
