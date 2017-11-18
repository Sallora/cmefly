import React, { Component } from "react";

/*
 * Things for Lora to read
 * ---
 * Set State: https://reactjs.org/docs/react-component.html#setstate
 */

class FlightItem extends Component {
  render() {
    const { faFlightID } = this.props.flight;

    return (
      <div className="flight-item">
        {faFlightID}
        <button
          onClick={() => {
            this.props.onSelected(faFlightID);
          }}
        >
          Select Flight
        </button>
      </div>
    );
  }
}

class GetFlightDetails extends Component {
  state = {
    tailNumber: "BAW4600",
    isFetching: false,
    flightData: null
  };

  fetchFlightDetails(tailNumber) {
    // Fetch returns a promise
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
    // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
    fetch(
      `http://localhost:5000/finaljs-c5415/us-central1/GetFlightDetails?tailNumber=${tailNumber}`
    )
      // https://developer.mozilla.org/en-US/docs/Web/API/Body/json
      .then(response => response.json()) // Parse the JSON into Javascript
      .then(flightData => this.setState({ flightData, isFetching: false })); //same as this.setState({ flightData: flightData });
  }

  renderFlightData() {
    const { flightData } = this.state;
    const { onSelectFlight } = this.props;

    return (
      <div className="flight-items">
        {flightData.FlightInfoStatusResult.flights.map((flight, i) => {
          return (
            <FlightItem
              key={i}
              flight={flight}
              onSelected={flightId => {
                onSelectFlight(flightId);
                this.setState({ flightData: null });
              }}
            />
          );
        })}
      </div>
    );
  }

  render() {
    const { tailNumber, flightData, isFetching } = this.state;

    return (
      <div>
        <h1>Get flight number</h1>

        {isFetching && <div>Fetching flight...</div>}

        {!isFetching && (
          <div>
            <input
              type="text"
              defaultValue={tailNumber}
              onChange={evt => {
                this.setState({ tailNumber: evt.target.value });
              }}
            />
            <button
              onClick={() => {
                this.setState({ isFetching: true, flightData: null });
                this.fetchFlightDetails(tailNumber);
              }}
            >
              Get Flight
            </button>
          </div>
        )}

        {flightData && this.renderFlightData()}
      </div>
    );
  }
}

export default GetFlightDetails;
