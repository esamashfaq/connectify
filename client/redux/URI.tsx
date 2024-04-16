import {Platform} from 'react-native';

let URI = '';

if (Platform.OS === 'ios') {
  URI = 'https://connectify-nu.vercel.app/api/v1';
} else {
  URI = 'https://connectify-nu.vercel.app/api/v1';
}

export {URI};