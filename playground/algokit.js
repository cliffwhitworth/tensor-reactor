// export function reversedString(s) {
function reverseString(s) {
    // chain functions
    return s.split("").reverse().join("");
}

// import {reverseString} from "playground";
s = "Hello World!";
// console.log(reverseString(s));

// p = "abba";
// console.log(p === reverseString(p));

function maxchar(s) {
    // make array of string characters
    arr = s.split("");

    // map and count characters
    charmap={};
    arr.forEach(function(c) {
        console.log(c);
        if (charmap[c]) {
            charmap[c]++;
        } else {
            charmap[c] = 1;
        }
    });

    // find the char with the highest count
    maxchar = '';
    max = 0;
    for(let [k, v] of Object.entries(charmap)) {
        console.log(k, v)
        if (v > max) {
            maxchar = k;
            max = v;
        }
    }
    return maxchar;
}

// console.log(maxchar(s));

function arraySlicer(arr, s) {
    slices = [];
    index = 0;

    // fill slices array with slices of arr
    while (index < arr.length) {
        slices.push(arr.slice(index, index+s));
        index += s;
    }
    return slices;
}

arr = [1,2,3,4,5,6,7];
s = 2;
// console.log(arraySlicer(arr, s));

function anagrams(s) {
    // chain functions
    return s.replace(/\s/g, "").toLowerCase().split("").sort().join("");
}

s1 = "Twelve plus one";
s2 = "Eleven plus two";
// console.log(anagrams(s1));
// console.log(anagrams(s2));
// console.log(anagrams(s1) === anagrams(s2));

function triangularN(n) {
    let level = "";
    let oCount = 0;

    // n(n + 1) / 2 
    for (let i = 0; i <= n; i++) {
        for (let j = 0; j <= n; j++) {
            if (i > j) {
                level += "O";
                oCount++;
            } else {
                level += " ";
            }
        }
        console.log(level);
        level = "";
    }
    console.log(oCount);
}

n = 5
// t = triangularN(n);

function isTriangular() {
    // the quadratic formula for s = (n(n+1))/2; n^2 + n - 2s = 0
    return Number.isInteger((Math.sqrt(1 + 8 * t) + 1)/2)
}

// console.log(isTriangular(15));

function propPyramid(n) {
    // prints a pyramid of probabilities of rolling two six sided die
    let levelLength = n * 2 - 1;
    let levelMidpoint = n - 1;
    // k decreases in relation to i
    let k = parseInt(n / 2);
    // l increases in relation to j
    let l = levelMidpoint - n;
    let level = "";
    let dice = [];
    // iterate combinations while one die is constant and other changes
    // e.g., 1,1 1,2 ... 1,6 2,6 ... 6,6
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < levelLength; j++) {
            if(j < levelMidpoint - i || j > levelMidpoint + i) {
                // space holder the size of [1,1]
                level += "     ";
            } else {
                // levelMidpoint = 5, l = -1 when i = 0
                // m increments when j > levelMidpoint else p increments
                let m = j - i - k + 1;                
                let p = j > levelMidpoint ? levelMidpoint + l : j + l;
                if(i % 2 === 0) {
                    // when i = 0, k = 3, p = 5 + -1
                    dice = [j > levelMidpoint ? m : k, p]
                } else {
                    dice = [p, j > levelMidpoint ? m + 1 : k]
                }   
                level += `[${dice[0]},${dice[1]}]`;            
            }
        }
        console.log(level);
        level = "";
        if (i % 2 === 1) {
            k -= 1;
            l += 1;
        }
    }
}

// six sided dice
// propPyramid(6);

function numSpirals(n) {
    let cnt = 1;
    let startRow = 0;
    let endRow = n - 1;
    let startCol = 0;
    let endCol = n - 1;
    let spiral = [];
    for(let i = 0; i < n; i++) {
        spiral.push([]);
    }

    // starts and ends work their way to the middle of the matrix
    while(startRow <= endRow && startCol <= endCol) {
        for(let i = startCol; i <= endCol; i++) {
            spiral[startRow][i] = cnt;
            cnt++;
        }
        startRow++;
        for (let i = startRow; i <= endRow; i++ ) {
            spiral[i][endCol] = cnt;
            cnt++;
        }    
        endCol--;
        for(let i = endCol; i >= startCol; i--) {
            spiral[endRow][i] = cnt;
            cnt++;
        }
        endRow--;
        for(let i = endRow; i >= startRow; i--) {
            spiral[i][startCol] = cnt;
            cnt++;
        }
        startCol++;
    }
    return spiral;
}

// console.log(numSpirals(5));

function fibonacci(n) {
    if (cache[n]) {
        return cache[n];
    }

    if (n < 2) {
        return n;
    }

    // recursive
    let result = fibonacci(n - 2) + fibonacci(n - 1);
    cache[n] = result;
    return result;
}

// memoization
cache = {};
// console.log(fibonacci(8));

function isFibonacci(n) {
    return Number.isInteger(Math.sqrt(5 * n * n + 4)) || Number.isInteger(Math.sqrt(5 * n * n - 4));
}

// console.log(isFibonacci(21));

const tf = require('@tensorflow/tfjs-node');
// require('@tensorflow/tfjs-node');

function detectNeighbor(s) {
    const splt = s.split(";");

    // get rows and columns provided in s
    const shape = splt[0].match(/\d/g).map(Number);

    // get the elements of the array and turn them to 0 or 1 for slice sum
    const arr = splt[1]
        .match(/\D/g)
        .join("")
        .replace(/\s/g, "")
        .replace(/\*|./g,function(match) {return (match==".")?0:1;})
        .split("")
        .map(Number);

    // create matrix
    let matrix = tf.tensor2d(arr, shape);
    matrix.print();
    matrix = matrix.pad([[1,1],[1,1]]);
    const buffer = tf.buffer(matrix.shape, matrix.dtype, matrix.dataSync());

    let rtnstr = "";
    for (let i = 0; i <= shape[0] + 1; i++) {
        for (let j = 0; j <= shape[1] + 1; j++) {
            if (i != 0 && i != shape[0] + 1 && j != 0 && j != shape[1] + 1) {
                // if (matrix.slice([i, j], 1).as1D().dataSync()[0] == 1) {
                if (buffer.get(i, j) == 1) {
                    rtnstr += "*";
                } else {
                    let slice = matrix.slice([i-1, j-1], [3, 3]);
                    rtnstr += slice.sum().dataSync()[0];
                } 
            }           
        }
    }

    console.log(rtnstr)
}

// turn **..........*** into 3 x 5 matrix
// **...
// .....
// ..***
// iterate through matrix
// return string if element = * print * else print count of * nearby (1 up, down, sides, diags)
// e.g., **100233201***
s = " 3, 5 ; **..........*** "
const clean = tf.tidy(() => {
    detectNeighbor(s);
});

// Create a buffer and set values at particular indices.
// const buffer = tf.buffer([2, 2]);
// buffer.set(1, 0, 0);
// buffer.set(2, 0, 1);
// buffer.set(3, 1, 0);

// Convert the buffer back to a tensor.
// buffer.toTensor().print();

// Create a buffer and set values at particular indices.
// const a = tf.tensor1d([1, 2, 3, 4]);
// const buf = tf.buffer(a.shape, a.dtype, a.dataSync());
// buf.set(5, 0);
// buf.toTensor().print();

function tensorSpiral() {
    let nx = 5;
    let cnt = 1;
    let startRow = 0;
    let endRow = nx - 1;
    let startCol = 0;
    let endCol = nx - 1;
    let bufx = tf.buffer([nx, nx]);

    // use matrix to spiral n++ towards the middle
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

tf.tidy(tensorSpiral);

console.log("Number of tensors in memory: %s", tf.memory().numTensors);