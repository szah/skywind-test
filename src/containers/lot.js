import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import constants from '../constants';
import uniqueId from 'lodash/uniqueId';
import { carArrived, withId, carDismissed } from '../ducks/cars';
import './lot.css';

const mapStateToProps = state => ({
    lots: state.lots,
    cars: state.cars,
});

class ParkingLot extends Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        lots: PropTypes.object.isRequired,
        cars: PropTypes.array.isRequired,
    };

    constructor(props) {
        super(props);

        this.handleArrivingCar = this.handleArrivingCar.bind(this);
        this.getCarInfoById = this.getCarInfoById.bind(this);
    }

    getCarInfoById(id) {
        const { cars } = this.props;
        if (id === null) {
            return (<span>No car</span>);
        }

        const car = cars.find(withId(id));

        return (<span>with type: {car.type}</span>);
    }

    handleArrivingCar() {
        const { dispatch, lots } = this.props;

        const type = this.refs.dropdown.value;

        if (lots.meta.freeSpots[type] > 0) {
            return dispatch(carArrived(type, uniqueId()));
        }

        return alert(`There is no spot for ${type}`);
    }

    resetParkingLot(lot) {
        const { dispatch, cars } = this.props;

        if (lot.car !== null) {
            return dispatch(carDismissed(cars.find(withId(lot.car)).id));
        }

        return alert('There is no car here');
    }

    render() {
        const { lots } = this.props;
        /* eslint-disable react/jsx-no-bind */
        return (
            <div>
                <div className="b-parking">
                    {lots.entities.map(lot => (
                        <div
                            className="b-parking__lot"
                            key={lot.id}
                            onClick={this.resetParkingLot.bind(this, lot)}
                        >
                            <div>Lot type: {lot.type}</div>
                            <div>Has car: {this.getCarInfoById(lot.car)}</div>
                        </div>
                    ))}
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
            </div>
        );
    }
}

export default connect(mapStateToProps)(ParkingLot);
