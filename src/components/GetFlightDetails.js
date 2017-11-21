import React, { Component } from "react";

/*
 * Things for Lora to read
 * ---
 * Set State: https://reactjs.org/docs/react-component.html#setstate
 */

class FlightItem extends Component {
  render() {
    const { faFlightID, origin, destination } = this.props.flight;

    return (
      <div className="flight-item">
        <strong>{faFlightID}</strong>
        <br />
        {origin.airport_name} -> {destination.airport_name}
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
      `${process.env
        .REACT_APP_ENDPOINT}/GetFlightDetails?tailNumber=${tailNumber}`
    )
      // https://developer.mozilla.org/en-US/docs/Web/API/Body/json
      .then(response => response.json()) // Parse the JSON into Javascript
      .then(jsonData => {
        // the jsonData variable contains the response from the FlightAware API
        // which contains a collection of flights inside of the
        // 'FlightInfoStatusResult' key. We want to now clean this list and
        // remove any flights that are older than 24 hours old.

        // Create a new array
        const flightData = [];
        // Loop through each flight object in our jsonData collection
        jsonData.FlightInfoStatusResult.flights.forEach(flight => {
          // Check if we have an arrival time
          if ("date" in flight.filed_arrival_time) {
            // Is the arrival date older than 24 hours?
            // 1. since the date is sent to us in non ISO format, the first
            // thing we do is split the string into parts on the "/" string
            const dateSegments = flight.filed_arrival_time.date.split("/");
            // 2. Construct a new Date object using the segments
            const arrivalDate = new Date(
              `${dateSegments[2]}/${dateSegments[1]}/${dateSegments[0]}`
            );
            // 3. Check if the date is today or in the future
            const delta = new Date();
            // Remove a day from our current date (i.e. yesterday)
            delta.setDate(delta.getDate() - 1);
            // Check if the arrival date is older than our time delta
            if (arrivalDate < delta) {
              // This flight is old, so let's return out and not add it to
              // our flight array
              return;
            }
          }

          // Flight is valid, so add it to our array
          flightData.push(flight);
        });
        this.setState({ flightData, isFetching: false });
      });
  }

  renderFlightData() {
    const { flightData } = this.state;
    const { onSelectFlight } = this.props;

    return (
      <div className="flight-items">
        {flightData.map((flight, i) => {
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
