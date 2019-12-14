const tf = require('@tensorflow/tfjs-node');

function tensorSpiral() {
    let nx = 5;
    let cnt = 1;
    let startRow = 0;
    let endRow = nx - 1;
    let startCol = 0;
    let endCol = nx - 1;
    let bufx = tf.buffer([nx, nx]);
    while (startRow <= endRow && startCol <= endCol) {
    for (let i = startCol; i <= endCol; i++) {
        bufx.set(cnt, startRow, i);
        cnt++;
    }
    startRow++;
    for (let i = startRow; i <= endRow; i++) {
        bufx.set(cnt, i, endCol);
        cnt++;
    }
    endCol--;
    for (let i = endCol; i >= startCol; i--) {
        bufx.set(cnt, endRow, i);
        cnt++;
    }
    endRow--;
    for (let i = endRow; i >= startRow; i--) {
        bufx.set(cnt, i, startCol);
        cnt++;
    }
    startCol++;
    }

    bufx.toTensor().print()
}

tensorSpiral();