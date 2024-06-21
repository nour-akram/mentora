import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://mentora-5s1z.onrender.com/api/',
});

export default axiosInstance;