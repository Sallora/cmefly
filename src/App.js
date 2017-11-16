import React, { Component } from "react";
import "./App.css";

/* 
 * Things for Lora to read
 * ---
 * Set State: https://reactjs.org/docs/react-component.html#setstate
 */

class App extends Component {
  state = {
    tailNumber: "BAW4600",
    flightData: null
  };

  fetchFlightDetails(tailNumber) {
    // Fetch returns a promise
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
    // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
    fetch(
      `http://localhost:5000/finaljs-c5415/us-central1/GetFlightDetails?tailNumber=${tailNumber}`,
      {}
    )
      // https://developer.mozilla.org/en-US/docs/Web/API/Body/json
      .then(response => response.json()) // Parse the JSON into Javascript
      .then(flightData => this.setState({ flightData })); //same as this.setState({ flightData: flightData });
  }

  renderFlightData() {
    const { flightData } = this.state;

    return (
      <ul>
        {flightData.FlightInfoStatusResult.flights.map((flight, i) => {
          return <li key={i}>{flight.faFlightID}</li>;
        })}
      </ul>
    );
  }

  render() {
    const { tailNumber, flightData } = this.state;

    return (
      <div>
        <h1>Get flight number</h1>
        <input
          type="text"
          defaultValue={tailNumber}
          onChange={evt => {
            this.setState({ tailNumber: evt.target.value });
          }}
        />
        <button
          onClick={() => {
            this.fetchFlightDetails(tailNumber);
          }}
        >
          Get Flight
        </button>

        {flightData && this.renderFlightData()}
      </div>
    );
  }
}

export default App;
