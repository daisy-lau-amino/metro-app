import React from 'react';
import PropTypes from 'prop-types';

import './styles/TrainFilter.scss';

const propTypes = {
  trains: PropTypes.array.isRequired,
  lines: PropTypes.array.isRequired,

  lineFilter: PropTypes.string,
  serviceTypeFilter: PropTypes.string,
  carCountFilter: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

  onLineChange: PropTypes.func.isRequired,
  onServiceTypeChange: PropTypes.func.isRequired,
  onCarCountChange: PropTypes.func.isRequired
};

class TrainFilter extends React.PureComponent {
  render () {
    return (
      <div className="train-filter">
        {this.renderLineOptions()}
        {this.renderServiceTypeOptions()}
        {this.renderCarCountOptions()}
      </div>
    );
  }

  renderLineOptions () {
    const lineOptions = ([{
      DisplayName: "All",
      LineCode: "all"
    }])
    .concat(this.props.lines)
    .concat([{
      DisplayName: "N/A",
      LineCode: null
    }]);

    return (
      <div className="train-filter__field">
        <div className="train-filter__title">Train Line</div>
        <div className="train-filter__options">
          {lineOptions.map((line, index) =>
            <div
              className={this.getOptionClassName(this.props.lineFilter === line.LineCode)}
              key={index}
              onClick={() => this.props.onLineChange(line.LineCode)}
            >
              {line.DisplayName}
            </div>
          )}
        </div>
      </div>
    );
  }

  renderServiceTypeOptions () {
    // options are from WMATA doc
    const serviceTypeOptions = [
      {
        label: "All",
        value: "all"
      }, {
        label: "Normal",
        value: "Normal"
      }, {
        label: "No Passengers",
        value: "NoPassengers"
      }, {
        label: "Special",
        value: "Special"
      }, {
        label: "Unknown",
        value: "Unknown"
      }
    ];
    return (
      <div className="train-filter__field">
        <div className="train-filter__title">Service Type</div>
        <div className="train-filter__options">
          {serviceTypeOptions.map((type, index) =>
            <div
              className={this.getOptionClassName(this.props.serviceTypeFilter === type.value)}
              key={index}
              onClick={() => this.props.onServiceTypeChange(type.value)}
            >
              {type.label}
            </div>
          )}
        </div>
      </div>
    );
  }

  renderCarCountOptions () {
    const carCounts = [...new Set(this.props.trains.map(train => train.CarCount).sort())];
    const carCountOptions = [
      {
        label: "All",
        value: "all"
      },
      ...carCounts.map(count => ({
        label: count,
        value: count
      }))
    ];
    return (
      <div className="train-filter__field">
        <div className="train-filter__title">Car Count</div>
        <div className="train-filter__options">
          {carCountOptions.map((count, index) =>
            <div
              className={this.getOptionClassName(this.props.carCountFilter === count.value)}
              key={index}
              onClick={() => this.props.onCarCountChange(count.value)}
            >
              {count.label}
            </div>
          )}
        </div>
      </div>
    );
  }

  getOptionClassName (isSelected) {
    return "train-filter__option" + (isSelected ? " train-filter__option--selected" : "");
  }
}

TrainFilter.propTypes = propTypes;

export default TrainFilter;
