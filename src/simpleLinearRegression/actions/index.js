// import axios from 'axios';
import {
    GET_DATA,
    LOAD_DATA_TYPE
} from './types';

const tf = require('@tensorflow/tfjs');

export const loadData = () => {
    return {
      type: LOAD_DATA_TYPE
    };
  };

export const getData = () => async (dispatch) => {
    // const response = await axios.get("http://192.168.1.223:8080/data/kc_house_data.csv");
    const response = await getTFData();
    dispatch({ type: GET_DATA, payload: response }); 
}

const getTFData = async () => {
    // 'https://storage.googleapis.com/tfjs-examples/multivariate-linear-regression/data/boston-housing-train.csv';

    const data = tf.data.csv("./data/kc_house_data.csv");
    const pointsDataset = data.map(record => ({
        x: record.sqft_living,
        y: record.price,
    }));
    const points = await pointsDataset.toArray();
    return points;
}