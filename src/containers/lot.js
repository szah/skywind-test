import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import constants from '../constants';
import uniqueId from 'lodash/uniqueId';
import reject from 'lodash/fp/reject';
import nth from 'lodash/nth';
import random from 'lodash/random';
import { carArrived, withId, carDismissed } from '../ducks/cars';
import { withCar } from '../ducks/lots';
import { autobind } from 'core-decorators';
import './lot.css';

const mapStateToProps = state => ({
    lots: state.lots,
    cars: state.cars,
});

const spotsSum = entities => entities.filter(withCar(null)).length;

@connect(mapStateToProps)
export default class ParkingLot extends Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        lots: PropTypes.object.isRequired,
        cars: PropTypes.array.isRequired,
    };

    @autobind
    getCarInfoById(id) {
        const { cars } = this.props;
        if (id === null) {
            return (<span className="b-car b-car_no-car">No car</span>);
        }

        const car = cars.find(withId(id));

        return (<span className={`b-car b-car_${car.type}`}>with type: {car.type}</span>);
    }

    @autobind
    handleArrivingCar() {
        const { dispatch, lots } = this.props;

        const type = this.refs.dropdown.value;

        if (lots.meta.freeSpots[type] > 0) {
            return dispatch(carArrived(type, uniqueId()));
        }

        return alert(`There is no spot for ${type}`);
    }

    @autobind
    resetParkingLot(lot) {
        const { dispatch, cars } = this.props;

        if (lot.car !== null) {
            return dispatch(carDismissed(cars.find(withId(lot.car)).id));
        }

        return alert('There is no car here');
    }

    @autobind
    dispatchRandomEvent() {
        const { dispatch, lots } = this.props;
        const randomNumber = random(0, 1);

        if (randomNumber === 0 && spotsSum(lots.entities) !== 0) {
            return dispatch(carArrived(this.rollCarType(lots.meta), uniqueId()));
        }

        if (spotsSum(lots.entities) !== lots.entities.length) {
            return dispatch(carDismissed(this.rollOccupiedLot(lots.entities).car));
        }

        return false;
    }

    @autobind
    rollCarType(meta) {
        const type = this.randomizeCarType(random(0, 2));
        if (meta.freeSpots[type] > 0) {
            return type;
        }
        return this.rollCarType.call(this, meta);
    }

    rollOccupiedLot(lots) {
        const occupiedLots = reject(withCar(null))(lots);
        return nth(occupiedLots, random(0, random(0, occupiedLots.length) - 1));
    }

    randomizeCarType(randomNumber) {
        switch (randomNumber) {
            case 0:
                return constants.carTypes.sedan;
            case 1:
                return constants.carTypes.truck;
            case 2:
                return constants.carTypes.disable;
            default:
                throw new Error('blame lodash');
        }
    }

    @autobind
    startRandomizer() {
        setInterval(this.dispatchRandomEvent, 1000);
    }

    render() {
        const { lots } = this.props;
        /* eslint-disable react/jsx-no-bind */
        return (
            <div>
                <div className="b-parking">
                    {lots.entities.map(lot => (
                        <div
                            className={`b-parking__lot b-parking__lot_${lot.type}`}
                            key={lot.id}
                            onClick={this.resetParkingLot.bind(this, lot)}
                        >
                            <div>Lot type: {lot.type}</div>
                            <div>Has car: {this.getCarInfoById(lot.car)}</div>
                        </div>
                    ))}
                </div>
                <div className="b-stats">
                    <p>Parking lot can afford:</p>
                    <div>Sedans: {lots.meta.freeSpots.sedan}</div>
                    <div>Cars for disabled: {lots.meta.freeSpots.disable}</div>
                    <div>Trucks: {lots.meta.freeSpots.truck}</div>
                </div>
                <div className="b-control-form">
                    <div>
                        <h2>Specify arriving car</h2>
                        <p>Type:</p>
                        <select ref="dropdown">
                            <option value={constants.carTypes.sedan}>Sedan</option>
                            <option value={constants.carTypes.truck}>Truck</option>
                            <option value={constants.carTypes.disable}>Disable</option>
                        </select>
                        <button onClick={this.handleArrivingCar}>Arrive</button>
                    </div>
                    <div>
                        <h2>To simulate dismissed car - click on non-empty parking lot</h2>
                    </div>
                </div>
                <div className="b-section">
                    <h2>Click start to randomize some events:</h2>
                    <button onClick={this.startRandomizer}>Start</button>
                </div>
            </div>
        );
    }
}

