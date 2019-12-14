import { IS_DATA_LOADED, 
          GET_DATA, 
          MODEL_NAME, 
          IS_DATA_PLOTTED,
          IS_DATA_SPLIT,
          MIN_MAX_VALUES,
          TRAIN_TEST_TENSORS,
          IS_MODEL_CREATED,
          CREATE_MODEL
         } from '../actions/types';

const INITIAL_STATE = {
  isDataLoaded: null,
  data: [],
  modelName: null,
  isDataPlotted: null,
  isDataSplit: null,
  minMaxValues: {},
  trainTestTensors: {},
  isModelCreated: null,
  createModelAction: {}
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CREATE_MODEL:
      return { ...state, createModelAction: action.payload };
    case IS_MODEL_CREATED:
      return { ...state, isModelCreated: true }
    case IS_DATA_LOADED:
      return { ...state, isDataLoaded: true };
    case GET_DATA:
      return { ...state,  data: action.payload };
    case MODEL_NAME:
      return { ...state, modelName: action.payload };
    case IS_DATA_PLOTTED:
      return { ...state, isDataPlotted: true };
    case IS_DATA_SPLIT:
      return { ...state, isDataSplit: true };
    case MIN_MAX_VALUES:
      return { ...state, minMaxValues: action.payload };
    case TRAIN_TEST_TENSORS:
      return { ...state, trainTestTensors: action.payload };
    default:
      return state;
  }
};