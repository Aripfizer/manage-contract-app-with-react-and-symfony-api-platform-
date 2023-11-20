import axios from 'axios';

const baseURL = process.env.API_BASE_URL;

if (!baseURL) {
  throw new Error('API_BASE_URL not defined in environment variables.');
}

export default axios.create({
  baseURL,
});
