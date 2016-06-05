import isFunction from 'lodash/isFunction';
import reject from 'lodash/fp/reject';

export const CAR_ARRIVED = 'parkingLot/cars/CAR_ARRIVED';
export const CAR_DISMISSED = 'parkingLot/cars/CAR_DISMISSED';

export const carArrived = (carType, id) => ({
    type: CAR_ARRIVED,
    carType,
    id,
});

export const carDismissed = (id) => ({
    type: CAR_DISMISSED,
    id,
});

export const withId = id => entity => entity.id === id;
export const notWithId = id => entity => entity.id !== id;

const actionsLookup = {
    [CAR_ARRIVED]: (state, action) => [...state, {
        id: action.id,
        type: action.carType,
    }],
    [CAR_DISMISSED]: (state, action) => reject(withId(action.id))(state),
};

export default function cars(state = [], action) {
    if (isFunction(actionsLookup[action.type])) return actionsLookup[action.type](state, action);

    return state;
}
