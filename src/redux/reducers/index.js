import { combineReducers } from 'redux';

const actionsReducer = () => {
    return [
        { name: "running", example: "Coco is running around"},
        { name: "looking", example: "Cleo is looking for some love"},
        { name: "sleeping", example: "Zimba is sleeping"},
        { name: "watching", example: "Peaches is watching the birds"}
    ];
}

const selectedActionReducer = (selectedActions=null, action) => {
    switch (action.type) {
        case "AN_ACTION":
            return action.payload;
        default:
            return selectedActions;
    }
}

// keys of this object show up in state
export default combineReducers({
    actions: actionsReducer,
    selectedAction: selectedActionReducer
});