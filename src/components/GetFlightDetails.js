import React, { Component } from "react";

/*
 * Things for Lora to read
 * ---
 * Set State: https://reactjs.org/docs/react-component.html#setstate
 */

class FlightItem extends Component {
  render() {
    const {
      faFlightID,
      airline,
      origin,
      destination,
      estimated_departure_time
    } = this.props.flight;

    return (
      <li className="list-group-item">
        <div className="d-flex">
          <div className="p-2">
            <strong>{airline}</strong>
            <small> {faFlightID}</small>
            <br />
            {origin.airport_name} &rarr; {destination.airport_name}
            <br />
            Departs {estimated_departure_time.date} at{" "}
            {estimated_departure_time.time}
          </div>
          <button
            className="btn btn-outline-primary ml-auto p-2"
            onClick={() => {
              this.props.onSelected(faFlightID);
            }}
          >
            Share this flight
          </button>
        </div>
      </li>
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
      <ul className="list-group">
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
      </ul>
    );
  }

  render() {
    const { tailNumber, flightData, isFetching } = this.state;

    return (
      <div>
        {isFetching && <div>Finding flights...</div>}

        {!isFetching &&
          !flightData && (
            <div>
              <label>Enter flight number (tail number):</label>
              <div className="form-group">
                <input
                  type="text"
                  className="form-control form-control-lg"
                  defaultValue={tailNumber}
                  onChange={evt => {
                    this.setState({ tailNumber: evt.target.value });
                  }}
                />
              </div>
              <button
                className="btn-lg btn-primary"
                onClick={() => {
                  this.setState({ isFetching: true, flightData: null });
                  this.fetchFlightDetails(tailNumber);
                }}
              >
                Search for flight
                <span className="ml-2">🔎</span>
              </button>
            </div>
          )}

        {flightData && this.renderFlightData()}
      </div>
    );
  }
}

export default GetFlightDetails;
