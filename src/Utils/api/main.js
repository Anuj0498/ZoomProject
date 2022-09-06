import axios from 'axios';
import { baseUrl } from './config.json';
const API = axios.create({
  baseURL: baseUrl,
});
API.interceptors.request.use(async req => {
  // const userdata = await AsyncStorage.getItem('profile');
  // const data = JSON.parse(userdata);
  if (data?.AccessToken) {
    // when server firstly ask for token and furthter process done
    try {
      req.headers.authorization = `Bearer ${data.AccessToken}`;
    } catch (error) {
      console.log('in api erro' + error.respose);
    }
  }
  return req;
});

export default API;
