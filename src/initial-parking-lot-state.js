import uniqueId from 'lodash/uniqueId';
import flowRight from 'lodash/flowRight';
import flatMap from 'lodash/fp/flatMap';
import keys from 'lodash/keys';
import range from 'lodash/range';

export const config = {
    sedan: 20,
    truck: 10,
    disabled: 5,
};

const generateCarFromKey = key => index => ({
    id: `${uniqueId()}-${index}`,
    type: key,
    car: null,
});

const fillCarCollection = cfg => key => range(cfg[key]).map(generateCarFromKey(key));

export const generateInitialState = cfg => flowRight(
    flatMap(fillCarCollection(cfg)),
    keys
)(cfg);

export default generateInitialState(config);
