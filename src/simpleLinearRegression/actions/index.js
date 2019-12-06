// import axios from 'axios';
import {
    GET_DATA
} from './types';

const tf = require('@tensorflow/tfjs');

export const getData = () => async (dispatch) => {
    // const response = await axios.get("http://192.168.1.223:8080/data/kc_house_data.csv");
    const response = await getTFData();
    dispatch({ type: GET_DATA, payload: response }); 
}

const getTFData = async () => {
    // 'https://storage.googleapis.com/tfjs-examples/multivariate-linear-regression/data/boston-housing-train.csv';

    const data = tf.data.csv("http://192.168.1.223:8080/data/kc_house_data.csv");
    const pointsDataset = data.map(record => ({
        x: record.sqft_living,
        y: record.price,
    }));
    const points = await pointsDataset.toArray();
    return points;
}