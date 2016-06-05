import { expect } from 'chai';
import { generateInitialState } from '../../../src/initial-parking-lot-state';


describe('Parking lot api', () => {
    describe('assert car will park in the right lot with given state', () => {
        it('parking api should be defined', () => {
            expect(generateInitialState).to.be.a('function');
        });

        it('generateInitialState should make state with correct amount of cars', () => {
            expect(generateInitialState({
                sedan: 2,
                disabled: 1,
                truck: 2,
            })).to.have.length(5);
        });
    });
});
