import api from '../apiSetup/';
// import history from '../history';
import {
  SIGN_IN,
  SIGN_OUT,
  POST_ROUTE,
  LIST_ROUTE,
  READ_ROUTE,
  DELETE_ROUTE,
  PUT_ROUTE
} from './types';

export const signIn = () => {
  return {
    type: SIGN_IN
  };
};

export const signOut = () => {
  return {
    type: SIGN_OUT
  };
};

export const postRoute = formValues => async (dispatch) => {
  const response = await api.post('/rest', { ...formValues });
  dispatch({ type: POST_ROUTE, payload: response.data });
}

export const listRoute = () => async (dispatch) => {
  const response = await api.get('/rest');
  dispatch({ type: LIST_ROUTE, payload: response.data });
}

export const readRoute = id => async (dispatch) => {
  const response = await api.get(`/rest/${id}`);
  dispatch({ type: READ_ROUTE, payload: response.data });
}

export const deleteRoute = id => async (dispatch) => {
  await api.delete(`/rest/${id}`)
  dispatch({ type: DELETE_ROUTE, payload: id });
}

export const putRoute = (id, formValues) => async (dispatch) => {
  const response = await api.put(`/rest/${id}`, formValues);
  dispatch({ type: PUT_ROUTE, payload: response.data });
}