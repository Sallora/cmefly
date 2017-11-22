import React, { Component } from "react";

class FlightInfo extends Component {
  state = {
    isFetching: true
  };

  componentDidMount() {
    const { flightRowKey } = this.props;

    fetch(`${process.env.REACT_APP_ENDPOINT}/RetrieveFlightInfo`, {
      method: "POST",
      body: JSON.stringify({ flightRowKey })
    })
      .then(response => {
        // Check if we were able to find a flight matching this database key
        if (response.status === 400) {
          throw new Error("Unable to find a flight match");
        }
        return response.json();
      })
      .then(data => this.setState({ flightData: data, isFetching: false }))
      .catch(err => {
        this.setState({ noFlightMatch: true, isFetching: false });
      });
  }

  render() {
    const { isFetching, flightData, noFlightMatch } = this.state;
    const { flightRowKey } = this.props;

    if (isFetching) {
      return <div>Fetching flight data...</div>;
    }

    if (noFlightMatch) {
      return <div>Unable to find flight with ID: {flightRowKey}</div>;
    }

    return (
      <ul className="list-group mt-3">
        <li className="list-group-item active">
          {`${flightData.airline} flight ${flightData.codeshares}`}
        </li>
        <li className="list-group-item">
          <h6>Flight ID:</h6> {flightData.faFlightID}
        </li>
        <li className="list-group-item">
          <h6>Journey:</h6> {flightData.origin.airport_name}&rarr;
          {flightData.destination.airport_name}
        </li>
        <li className="list-group-item">
          <h6>Estimated departure:</h6>
          {`${flightData.estimated_departure_time.date} at ${flightData
            .estimated_departure_time.time}`}
        </li>
        <li className="list-group-item">
          <h6>Estimated arrival:</h6>
          {`${flightData.estimated_arrival_time.date} at ${flightData
            .estimated_arrival_time.time}`}
        </li>
      </ul>
    );
  }
}

export default FlightInfo;
