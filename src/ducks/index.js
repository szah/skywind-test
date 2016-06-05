import { combineReducers } from 'redux';
import cars from './cars';
import lots from './lots';

const rootReducer = combineReducers({
    cars,
    lots,
});

export default rootReducer;
