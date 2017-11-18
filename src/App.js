import React, { Component } from "react";
import GetFlightDetails from "./components/GetFlightDetails";
import ShareFlight from "./components/ShareFlight";

import "./App.css";

class App extends Component {
  state = {
    flightToShare: null
  };

  render() {
    const { flightToShare } = this.state;

    return (
      <div className="app">
        <GetFlightDetails
          onSelectFlight={selectedFlight =>
            this.setState({ flightToShare: selectedFlight })}
        />

        {flightToShare && <ShareFlight flightId={flightToShare} />}
      </div>
    );
  }
}

export default App;
