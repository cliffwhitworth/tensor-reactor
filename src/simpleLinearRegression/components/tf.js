const tf = require('@tensorflow/tfjs');
const tfvis = require('@tensorflow/tfjs-vis');

export const plotAndCreateModel = async (points, featureName) => {

    const model = createModel();
    const layer = model.getLayer(undefined, 0);
    
    tfvis.show.modelSummary({ name: `Model Summary`, tab: `Model` }, model);
    tfvis.show.layer({ name: `Layer 1`, tab: `Model Inspection` }, layer);

    tfvis.render.scatterplot(
        {name: `${featureName} vs Price`},
        {values: points, series: ["original"]},
        {
            xLabel: featureName,
            yLabel: "Price",
        }
    )
    
    // const result = await trainModel(model, X_train, y_train);
    // const trainLoss = result.history.loss.pop();
    // console.log(`Training loss: ${trainLoss}`);

    // const valLoss = result.history.val_loss.pop();
    // console.log(`Validation loss: ${valLoss}`);

    // const testTensor = model.evaluate(X_test, y_test);
    // const testLoss = await testTensor.dataSync();
    // console.log(`Testing loss: ${testLoss}`);

}

const makeTensor = data => {    
    return tf.tensor2d(data, [data.length, 1]);
}

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

export const denormalizeTensor = (tensor, min, max) => {
    // return normalized data to original values
    return tensor.mul(max.sub(min)).add(min);
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

export const trainModel = async (model, x, y) => {
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

export const splitTrainTestData = async data => {

    // shuffle data
    tf.util.shuffle(data);
                        
    // points need to be even for split
    if (data.length % 2 !== 0) {
        data.pop();
    }

    const {X, y} = await prepareData(data);

    // split the data
    const [X_train, X_test] = tf.split(X.tensor, 2);
    const [y_train, y_test] = tf.split(y.tensor, 2);

    return [X_train, y_train, X_test, y_test];

}

const prepareData = async points => {
    // make tensor of x and y values
    const rawX = await makeTensor(points.map(p => p.x));
    const rawY = await makeTensor(points.map(p => p.y));
    console.log("Number of tensors in memory: %s", tf.memory().numTensors);

    // normalize data
    const X = normalizeTensor(rawX);
    const y = normalizeTensor(rawY);    
    console.log("Number of tensors in memory: %s", tf.memory().numTensors);
    return [X, y];
}