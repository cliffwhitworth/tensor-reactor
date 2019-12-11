const tf = require('@tensorflow/tfjs');
const tfvis = require('@tensorflow/tfjs-vis');

export const plot = (points, featureName) => {

    tfvis.render.scatterplot(
        {name: `${featureName} vs Price`},
        {values: points, series: ["original"]},
        {
            xLabel: featureName,
            yLabel: "Price",
        }
    )
}

const makeTensor = data => {    
    return tf.tensor2d(data, [data.length, 1]);
}

export const normalizeTensor = (tensor, haveMin=null, haveMax=null) => {
    // min max normalization
    const min = haveMin || tensor.min();
    const max = haveMax || tensor.max();
    return {
        tensor: tensor.sub(min).div(max.sub(min)),
        min,
        max
    };
}

export const denormalizeTensor = (tensor, min, max) => {
    // return normalized data to original values
    return tensor.mul(max.sub(min)).add(min);
}

export const createModel = () => {
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

export const trainModel = (model, x, y) => {
    // const { onBatchEnd, onEpochEnd } = tfvis.show.fitCallbacks (
    const {onEpochEnd} = tfvis.show.fitCallbacks (
        { name: 'Training Performance' },
        ['loss']
    )

    return model.fit(x, y, {
        batchSize: 32, // default
        epochs: 10,
        validationSplit: 0.2,
        // callbacks: tfvis.show.fitCallbacks(
        //     { name: 'Training Performance' },
        //     ['loss']
        // )
        callbacks: {
            // onEpochEnd: (epoch, log) => console.log(`Epoch ${epoch}: loss = ${log.loss}`)
            // onEpochEnd, onBatchEnd, 
            onEpochEnd,            
        }
    });
}

export const splitTrainTestData = async (incoming) => {

    const data = await incoming;
    // shuffle data
    tf.util.shuffle(data);
                        
    // points need to be even for split
    if (data.length % 2 !== 0) {
        data.pop();
    }

    // make tensor of x and y values
    const rawX = makeTensor(data.map(p => p.x));
    const rawY = makeTensor(data.map(p => p.y));
    console.log("Number of tensors in memory: %s", tf.memory().numTensors);

    // normalize data
    const X = normalizeTensor(rawX);
    console.log(X.min.dataSync()[0]);
    const X_min = X.min.dataSync()[0];
    const X_max = X.max.dataSync()[0];
    const y = normalizeTensor(rawY); 
    const y_min = y.min.dataSync()[0];
    const y_max = y.max.dataSync()[0]; 
    console.log("Number of tensors in memory: %s", tf.memory().numTensors);
    rawX.dispose();
    rawY.dispose();
    console.log("Number of tensors in memory after disposal: %s", tf.memory().numTensors);
    
    // split the data
    const [X_train, X_test] = tf.split(X.tensor, 2);
    const [y_train, y_test] = tf.split(y.tensor, 2);
    return [X_min, X_max, y_min, y_max, X_train, y_train, X_test, y_test];
    // return [X_train, y_train, X_test, y_test];

}