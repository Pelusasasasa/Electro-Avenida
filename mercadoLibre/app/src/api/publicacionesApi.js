import axios from 'axios';

const  URL = process.env.REACT_APP_URL;

const publicacionesApi = axios.create({
    baseURL: URL
});

export default publicacionesApi;