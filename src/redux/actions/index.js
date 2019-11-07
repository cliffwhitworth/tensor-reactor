// Action Creator

// named export
// if named export use import { selectAction } from './actions';
// if export default App use import App from './redux/App';
export const selectAction = action => {
    // return Action
    return {
        type: "AN_ACTION", // required
        payload: action
    };
}