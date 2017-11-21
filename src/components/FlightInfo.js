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

    return <div>{flightData.faFlightID}</div>;
  }
}

export default FlightInfo;
