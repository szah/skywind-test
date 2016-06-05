import React, { Component } from 'react';
import { Provider } from 'react-redux';
import configureStore from '../store/configureStore';
import Lot from './lot';

const initialState = window.PARKING_LOT_STATE;
const store = configureStore({
    initialState,
    history,
});

export default class Root extends Component {
    render() {
        return (
            <Provider store={store} key="provider">
                <Lot />
            </Provider>
        );
    }
}
