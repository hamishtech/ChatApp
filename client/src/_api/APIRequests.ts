import axios from 'axios';

export const getUsers = async () => {
  try {
    const request = await axios.get('/api/users');
    const response = request.data;
    return response;
  } catch (error) {
    console.log('error has occured fetching users');
  }
};
