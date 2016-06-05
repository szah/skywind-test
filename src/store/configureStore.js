import { createStore, applyMiddleware, compose } from 'redux';
import createLogger from 'redux-logger';
import rootReducer from '../ducks/index';

const loggerMiddleware = createLogger({
    level: 'info',
    collapsed: true,
});

const finalCreateStore = () => compose(applyMiddleware(loggerMiddleware))(createStore);

const configureStore = ({ initialState = {} }) =>
    finalCreateStore()(rootReducer, initialState);

export default configureStore;
