import React from 'react';
import PropTypes from 'prop-types';

import './styles/TrainListItem.scss';

const propTypes = {
  item: PropTypes.object.isRequired
};

class TrainListItem extends React.PureComponent {
  render () {
    return (
      <div className="train-list-item">
        {this.renderLineBar()}
        {this.renderDetails()}
      </div>
    );
  }

  renderLineBar () {
    const { item } = this.props;
    const lineBarStyle = item.LineCode && {
      backgroundColor: item.lineName
    };
    return (
      <div className="train-list-item__line-bar" style={lineBarStyle}>
        {!!item.LineCode && <div className="train-list-item__line-dot" />}
      </div>
    );
  }

  renderDetails () {
    const { item } = this.props;
    const visibleFields = [
      {
        label: "Train ID / Number",
        value: `${item.TrainId} / ${item.TrainNumber}`
      },
      {
        label: "Line Color",
        value: item.lineName
      },
      {
        label: "Service Type",
        value: item.ServiceType
      },
      {
        label: "Car Count",
        value: item.CarCount
      }
    ];
    const visibleLongFields = [
      {
        label: "Current Location",
        value: item.currentLocation,
      },
      {
        label: "Destination",
        value: item.destinationName
      }
    ];
    return (
      <div className="train-list-item__details">
        <div className="train-list-item__short-details">
          {visibleFields.map((field, index) =>
            this.renderField(field, index, false)
          )}
        </div>
        <div className="train-list-item__long-details">
          {visibleLongFields.map((field, index) =>
            this.renderField(field, index, true)
          )}
        </div>
      </div>
    );
  }

  renderField (field, index, isLongField) {
    const fieldClassName = "train-list-item__field" + (isLongField ? " train-list-item__field--long" : "");
    return (
      <div className={fieldClassName} key={index}>
        <div className="train-list-item__field-label">{field.label}</div>
        <div className="train-list-item__field-value">{field.value}</div>
      </div>
    );
  }
}

TrainListItem.propTypes = propTypes;

export default TrainListItem;
