const Redux = require('redux');

console.clear();

// Redux Cycle
// Action Creator -> Action -> Dispatch -> Reducers -> State

// Action Creators
const addAction = (name, amountToAdd) => {
    return { // Action
        type: "ADD_ACTION",
        payload: { 
            // name, amount
            name: name,
            amountToAdd: amountToAdd
        }
    }
}

const subtractAction = (name, amountToSubtract) => {
    return { // Action
        type: "SUBTRACT_ACTION",
        payload: {
            name: name,
            amountToSubtract: amountToSubtract
        }
    }    
}

const deleteAction = (name, amountToDelete) => {
    return { // Action
        type: "DELETE_ACTION",
        payload: {
            name: name,
            amountToDelete: amountToDelete
        }
    }
}

// Reducers

const manageAdditions = (addList = [], action) => {
    switch (action.type) {
        case "ADD_ACTION":
            return [...addList, action.payload];
        case "DELETE_ACTION":
            return addList.filter(load => load.name !== action.payload.name);
        default:
            return addList;
    }
}

const manageSubtractions = (subtractList = [], action) => {
    if (action.type === "SUBTRACT_ACTION") {
        // actionList.push(action.payload) // modify array
        return [...subtractList, action.payload]; // create new array
    }

    return subtractList;
}

const manageAmount = (amount = 0, action) => {
    switch (action.type) {
        case "ADD_ACTION":
            return amount + action.payload.amountToAdd;
        case "SUBTRACT_ACTION":
            return amount - action.payload.amountToSubtract;
        case "DELETE_ACTION":
            return amount - action.payload.amountToDelete;
        default:
            return amount;
    }
}

const{ createStore, combineReducers } = Redux;

const theReducers = combineReducers({
    manageAdditions: manageAdditions,
    manageSubtractions: manageSubtractions,
    manageAmount: manageAmount
})

const store = createStore(theReducers);

// let action = addAction("Furbutts", 40);
// console.log(action);
// store.dispatch(action);
store.dispatch(addAction("Furbutts", 40));
console.log(store.getState());
console.log();

// action = subtractAction("Hardshell", 30);
// console.log(action);
// store.dispatch(action);
store.dispatch(subtractAction("Hardshell", 30));
console.log(store.getState());
console.log();

// action = addAction("Feathers", 100);
// console.log(action);
// store.dispatch(action);
store.dispatch(addAction("Feathers", 100));
console.log(store.getState());
console.log();

store.dispatch(addAction("Flies", 50));
console.log(store.getState());
console.log();

store.dispatch(deleteAction("Flies", 
            store.getState()
            .manageAdditions
            .filter(list => list.name === "Flies")[0].amountToAdd));
console.log(store.getState());
console.log();
