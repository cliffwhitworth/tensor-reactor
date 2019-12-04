// https://github.com/priyesh18/tensorflowjs-model

const tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-node');

const normalizeTensor = tensor => {
    // min max normalization
    const min = tensor.min();
    const max = tensor.max();
    return {
        tensor: tensor.sub(min).div(max.sub(min)),
        min,
        max
    };
}

const denormalizeTensor = (tensor, min, max) => {
    // return normalized data to original values
    return tensor.mul(max.sub(min)).add(min);
}

const getData = async () => {
    // import data
    // npm i http-server -
    // navigate to ~/code/tensor-reactor/playground
    // http-server
    const data = await tf.data.csv("http://127.0.0.1:8080/data/kc_house_data.csv");

    // shuffle data

    // map x and y values
    const pointsDataset = data.map(record => ({
        x: record.sqft_living,
        y: record.price,
    }));
    const points = await pointsDataset.toArray();
    tf.util.shuffle(points);

    // points need to be even for split
    if (points.length % 2 != 0) {
        points.pop();
    }

    // make tensor of x and y values
    const xValues = await points.map(p => p.x);
    const rawX = tf.tensor2d(xValues, [xValues.length, 1]);
    const yValues = await points.map(p => p.y);
    const rawY = tf.tensor2d(yValues, [yValues.length, 1]); 
    
    // normalize data
    const X = normalizeTensor(rawX);
    const y = normalizeTensor(rawY);

    // inspect data
    // X.tensor.print();
    // y.tensor.print();
    // denormalizeTensor(X.tensor, X.min, X.max).print();

    // split the data
    const [X_train, X_test] = tf.split(X.tensor, 2);
    const [y_train, y_test] = tf.split(y.tensor, 2);

    // inspect data
    // X_train.print(true);

    const model = createModel();
    model.summary();
    // const layer = model.getLayer(undefined, 0);
}

const createModel = () => {
    const model = tf.sequential();

    model.add(tf.layers.dense({
        units: 1,
        useBias: true,
        activation: 'linear',
        inputDim: 1,
    }));

    const optimizer = tf.train.sgd(0.1);
    model.compile({
        loss: 'meanSquaredError',
        optimizer,
    });

    return model;
}

getData();
