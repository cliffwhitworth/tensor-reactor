import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import authReducer from './authReducer';
import routeReducer from './routeReducer';

export default combineReducers({
  auth: authReducer,
  form: formReducer,
  routes: routeReducer
});
