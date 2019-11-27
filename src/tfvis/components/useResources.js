import { useState, useEffect } from 'react';

const tf = require('@tensorflow/tfjs');
const tfvis = require('@tensorflow/tfjs-vis');

const useResources = resource => {
    const [resources, setResources] = useState([]);

    const plot = async (pointsArray, featureName) => {
        tfvis.render.scatterplot(
            {name: `${featureName} vs Price`},
            {values: pointsArray, series: ["original"]},
            {
                xLabel: featureName,
                yLabel: "Price",
            }
        )
    }

    useEffect(() => {
        (async (resource) => {
            // start http-server --cors
            const data = tf.data.csv(`http://127.0.0.1:8080/data/${resource}`); 
            let resourceData = await data.take(10).toArray();
            console.log(resourceData)
            const points = data.map(record => ({
                x: record.sqft_living,
                y: record.price,
            }));
            plot(await points.toArray(), "Square Feet");
            setResources(resourceData);
        })(resource);
    }, [resource]);

    return resources;

}

export default useResources;