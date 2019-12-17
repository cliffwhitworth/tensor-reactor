// import axios from 'axios';
import {
    GET_DATA,
    IS_DATA_LOADED,
    MODEL_NAME,
    IS_DATA_PLOTTED,
    IS_DATA_SPLIT,
    MIN_MAX_VALUES,
    TRAIN_TEST_TENSORS,
    CREATE_MODEL,
    IS_MODEL_CREATED,
    IS_MODEL_TRAINED,
    IS_MODEL_SAVEABLE,
    IS_PREDICT_READY
} from './types';

const tf = require('@tensorflow/tfjs');

export const createSaveableModelState = () => {
    return {
      type: IS_MODEL_SAVEABLE
    };
};

export const createPredictReadyState = () => {
    return {
      type: IS_PREDICT_READY
    };
};

export const createTrainedModelState = () => {
    return {
      type: IS_MODEL_TRAINED
    };
};

export const createModelState = () => {
    return {
      type: IS_MODEL_CREATED
    };
};

export const loadData = () => {
    return {
      type: IS_DATA_LOADED
    };
};

export const plotData = () => {
    return {
      type: IS_DATA_PLOTTED
    };
};

export const splitData = () => {
    return {
      type: IS_DATA_SPLIT
    };
};

export const dispatchModel = model => dispatch => {
    dispatch({ type: CREATE_MODEL, payload: model })
}

export const setModelName = name => dispatch => {
    dispatch({ type: MODEL_NAME, payload: name });
};

export const fillMinMaxObject = store => dispatch => {
    dispatch({ type: MIN_MAX_VALUES, payload: store });
};

export const fillTrainTestObject = store => dispatch => {
    dispatch({ type: TRAIN_TEST_TENSORS, payload: store });
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