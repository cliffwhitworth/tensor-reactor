import axios from 'axios';
import { accesskey } from './Key';

export default axios.create({
    baseURL: 'https://api.unsplash.com',
    headers: {
        Authorization: `Client-ID ${accesskey}`
    }
});