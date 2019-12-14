import { LOAD_DATA_TYPE, GET_DATA } from '../actions/types';

const INITIAL_STATE = {
  isDataLoaded: null
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOAD_DATA_TYPE:
      return { ...state, isDataLoaded: true };
    case GET_DATA:
      return { ...state,  data: action.payload };
    default:
      return state;
  }
};