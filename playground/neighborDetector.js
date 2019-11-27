
const tf = require('@tensorflow/tfjs');

const nDetect = s => {
    let rtn = '';
    let arr = (s.split(';'));
    let [rows, cols] = arr[0].match(/\d/g).map(Number);
    let mStr = arr[1].replace(/\s/g, '')
        .replace(/\*|./g,function(match) {return (match==".")?0:1;})
        .split('')
        .map(Number);
    let a = tf.tensor2d(mStr,[rows, cols]);
    a.print();
    a = a.pad([[1,1],[1,1]]);
    const mat = tf.buffer(a.shape, a.dtype, a.dataSync());
    for (let x = 0; x <= rows; x++) {
        for (let y = 0; y <= cols; y++) { 
            if (x > 0 && x < rows+1 && y > 0 && y < cols+1) {
                if (mat.get(x,y) == 1) {
                    rtn += '*';
                } else {
                    rtn += mat.toTensor().slice([x-1, y-1], [3, 3]).sum().dataSync()[0];
                }
            }             
        }
    }
    return rtn;
}

s = ' 3, 5, ; **..........***';
console.log(nDetect(s));