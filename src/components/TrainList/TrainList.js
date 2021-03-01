import React from 'react';
import { getLiveTrainPositions, getStandardRoutes } from '../../services/trains';
import {
  getLines,
  getAllStations,
  getLineNameByCode,
  getTrainCurrentLocation,
  getStationByCode
} from '../../services/lines';

import TrainFilter from './components/TrainFilter';
import TrainListItem from './components/TrainListItem';

import loadingImage from './images/loading.gif';
import './styles/TrainList.scss';

class TrainList extends React.Component {

  state = {
    isLoading: true,
    lastUpdateTime: '-',
    trains: [],
    lines: [],
    stations: [],
    routes: [],
    lineFilter: 'all',
    serviceTypeFilter: 'all',
    carCountFilter: 'all'
  };

  componentDidMount () {
    Promise.all([
      getLines(),
      getAllStations(),
      getStandardRoutes()
    ])
    .then(([lines, stations, routes]) =>
      this.setState({
        lines,
        stations,
        routes
      }, () => {
        this.updateTrains();
        this.updateTrainInfoInterval = setInterval(this.updateTrains, 30 * 1000);
      })
    );
    ;
  }

  componentWillUnmount () {
    clearInterval(this.updateTrainInfoInterval);
  }

  updateTrains = () => {
    getLiveTrainPositions().then(trains =>
      this.setState({
        isLoading: false,
        trains,
        lastUpdateTime: new Date().toLocaleTimeString('en-US', { timeZone: 'America/New_York' }) + ' (EST)'
      })
    );
  };

  getFilteredTrains () {
    const { trains, lines, stations, routes, lineFilter, serviceTypeFilter, carCountFilter } = this.state;
    return trains
      .filter(train => {
        const matchesLine = lineFilter === 'all' || lineFilter === train.LineCode;
        const matchesServiceType = serviceTypeFilter === 'all' || serviceTypeFilter === train.ServiceType;
        const matchesCarCount = carCountFilter === 'all' || carCountFilter === train.CarCount;
        return matchesLine && matchesServiceType && matchesCarCount;
      })
      .map(train => ({
        ...train,
        lineName: getLineNameByCode(lines, train.LineCode),
        currentLocation: getTrainCurrentLocation(stations, routes, train.LineCode, train.CircuitId),
        destinationName: getStationByCode(stations, train.DestinationStationCode)
      }));
  }

  render () {
    const { isLoading } = this.state;
    return (
      <div className="train-list">
        {isLoading && <img className="train-list__loading-image" src={loadingImage} alt="Loading icon" />}
        {!isLoading && this.renderTrainFilter()}
        {!isLoading && this.renderLastUpdateTime()}
        {!isLoading && this.renderTrainList()}
      </div>
    );
  }

  renderTrainFilter () {
    const { trains, lines, lineFilter, serviceTypeFilter, carCountFilter } = this.state;
    const props = {
      trains,
      lines,
      lineFilter,
      serviceTypeFilter,
      carCountFilter,
      onLineChange: this.handleLineFilterChange,
      onServiceTypeChange: this.handleServiceTypeFilterChange,
      onCarCountChange: this.handleCarCountFilterChange
    };
    return (
      <TrainFilter {...props} />
    );
  }

  renderLastUpdateTime () {
    return (
      <div className="train-list__last-update">
        {`Last Update Time: ${this.state.lastUpdateTime}`}
      </div>
    );
  }

  renderTrainList () {
    const filteredTrains = this.getFilteredTrains();
    return (
      <div className="train-list__list">
        {!filteredTrains.length && <div className="train-list__no-result-message">
          No matches found. Please try another set of criteria.
        </div>}
        {filteredTrains.map((train, index) =>
          <TrainListItem key={index} item={train} />
        )}
      </div>
    );
  }

  handleLineFilterChange = lineFilter => this.setState({ lineFilter });

  handleServiceTypeFilterChange = serviceTypeFilter => this.setState({ serviceTypeFilter });

  handleCarCountFilterChange = carCountFilter => this.setState({ carCountFilter });
}

export default TrainList;
