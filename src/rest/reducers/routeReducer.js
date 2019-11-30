import _ from 'lodash';
import {
  POST_ROUTE,
  LIST_ROUTE,
  READ_ROUTE,
  DELETE_ROUTE,
  PUT_ROUTE
} from '../actions/types';

export default (state = {}, action) => {
  switch (action.type) {
    case POST_ROUTE:
      return { ...state, [action.payload.id]: action.payload };
    case LIST_ROUTE:
      return { ...state, ..._.mapKeys(action.payload, 'id') };
    case READ_ROUTE:
      return { ...state, [action.payload.id]: action.payload };    
    case DELETE_ROUTE:
      return _.omit(state, action.payload);
    case PUT_ROUTE:
      // array-based
      // return state.map(route => {
      //   if (route.id === action.payload.id) {
      //     return action.payload;
      //   } else {
      //     return route;
      //   }
      // });
      // object-based
      // const newState = { ...state };
      // newState[action.payload.id] = action.payload;
      // return newState;
      // with ES2015 Key Interpolation
      // return { ...state, [action.payload.id]: action.payload }
      return { ...state, [action.payload.id]: action.payload };
    default:
      return state;
  }
};
