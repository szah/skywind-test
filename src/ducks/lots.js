import isFunction from 'lodash/isFunction';
import { CAR_ARRIVED, CAR_DISMISSED } from './cars';
import initialState, { config } from '../initial-parking-lot-state';
import constants from '../constants';
import flowRight from 'lodash/flowRight';
import flatMap from 'lodash/fp/flatMap';
import head from 'lodash/head';

const mapCarTypeToLotType = {
    [constants.carTypes.sedan]: [constants.carTypes.sedan, constants.carTypes.truck],
    [constants.carTypes.truck]: [constants.carTypes.truck],
    [constants.carTypes.disable]: [
        constants.carTypes.disable,
        constants.carTypes.sedan,
        constants.carTypes.truck,
    ],
};

const withType = type => entity => entity.type === type;

const parkCar = ({ carType, id }) => state => {
    const eligibleLotTypes = mapCarTypeToLotType[carType];

    const firstSpot = flowRight(
        head,
        flatMap(lotType => state.entities.filter(withType(lotType)))
    )(eligibleLotTypes);

    return {
        ...state,
        entities: state.entities.map(lot => {
            if (lot.id === firstSpot.id) {
                return {
                    ...lot,
                    car: id,
                };
            }
            return lot;
        }),
    };
};

const resetLot = ({ id }) => state => ({
    ...state,
    entities: state.entities.map(lot => {
        if (lot.car === id) {
            return {
                ...lot,
                car: null,
            };
        }
        return lot;
    }),
});

const updateMeta = state => ({
    ...state,
    meta: {
        ...state.meta,
        freeSpots: {
            [constants.carTypes.sedan]: state.entities.filter(
                withType(constants.carTypes.sedan)
            ).length,
            [constants.carTypes.truck]: state.entities.filter(
                withType(constants.carTypes.truck)
            ).length,
            [constants.carTypes.disable]: state.entities.filter(
                withType(constants.carTypes.disable)
            ).length,
        },
    },
});

const actionsLookup = {
    [CAR_ARRIVED]: (state, action) => flowRight(
        updateMeta,
        parkCar(action)
    )(state),
    [CAR_DISMISSED]: (state, action) => flowRight(
        updateMeta,
        resetLot(action)
    )(state),
};

export default function lots(state = {
    entities: initialState,
    meta: {
        freeSpots: {
            ...config,
        },
    },
}, action) {
    if (isFunction(actionsLookup[action.type])) return actionsLookup[action.type](state, action);

    return state;
}
