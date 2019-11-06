// https://js.tensorflow.org/api/latest/

const tf = require('@tensorflow/tfjs');

function neighborDetector(s) {
    let splt = s.split(";");
    let shape  = splt[0].match(/\d/g).map(Number);
    let arr  = splt[1].match(/\d/g).map(Number);
    let matrix = tf.tensor(arr, shape);

    matrix.pad([[1, 1], [1, 1]]).print();
    matrix = matrix.pad([[1, 1], [1, 1]]);
    // matrix.slice([0, 0], [3, 3]).print();
    slice = matrix.slice([1, 4], [3, 3]);
    slice.print();
    console.log(slice.sum().dataSync()[0]);
}

s = " 3, 5, ; 110000000000111";
neighborDetector(s)
