import React, { Component } from "react";
import GetFlightDetails from "./components/GetFlightDetails";
import ShareFlight from "./components/ShareFlight";
import FlightInfo from "./components/FlightInfo";

import "./App.css";

class App extends Component {
  state = {
    flightRowKey: null,
    mode: "flyer"
  };

  componentWillMount() {
    // ComponentWillMount is called before the component is added to
    // the DOM, read this URL for more:
    // https://reactjs.org/docs/react-component.html#componentwillmount

    // In this function, we're going to figure out which mode we're in.
    // Check if we are in flyer or watcher mode by inspecting the URL
    // If there is a URL segment i.e. http://localhost/something then
    // we'll assume we're in watcher mode.
    const urlSeg = window.location.pathname.split("/").pop();
    if (urlSeg && urlSeg !== " ") {
      // Update the state so we know we're in watcher mode
      this.setState({ mode: "watcher", flightRowKey: urlSeg });
    }
  }

  render() {
    const { mode } = this.state;

    // Depending on which mode we're in, we'll call the relevant function
    // to render the correct response to the screen.
    return (
      <div className="app">
        <nav className="navbar navbar-dark bg-dark">
          <span className="navbar-brand">
            cMeFly
            <span className="ml-2">✈️</span>
          </span>
        </nav>
        <main className="container">
          {mode === "watcher"
            ? this.renderWatcherMode()
            : this.renderFlyerMode()}
        </main>
      </div>
    );
  }

  renderFlyerMode() {
    const { flightToShare } = this.state;

    return (
      <div className="flyer">
        <h1>Share your flight:</h1>
        <hr />
        {!flightToShare ? (
          <GetFlightDetails
            onSelectFlight={selectedFlight =>
              this.setState({ flightToShare: selectedFlight })}
          />
        ) : (
          <ShareFlight flightId={flightToShare} />
        )}
      </div>
    );
  }

  renderWatcherMode() {
    const { flightRowKey } = this.state;

    return (
      <div className="watcher">
        <h2>Flight overview</h2>
        <FlightInfo flightRowKey={flightRowKey} />
      </div>
    );
  }
}

export default App;
