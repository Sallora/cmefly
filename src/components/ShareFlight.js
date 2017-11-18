import React, { Component } from "react";

class ShareFlight extends Component {
  state = {
    isSharing: false,
    key: null
  };

  shareFlight(flightId) {
    fetch(`http://localhost:5000/finaljs-c5415/us-central1/ShareFlight`, {
      method: "POST",
      body: JSON.stringify({ flightId })
    })
      .then(response => response.json())
      .then(json => this.setState({ key: json.key }));
  }

  render() {
    const { flightId } = this.props;
    const { key } = this.state;

    return (
      <div className="share-flight">
        <h2>The flight you want to share is: {flightId}</h2>
        <button onClick={() => this.shareFlight(flightId)}>
          Share this flight
        </button>
        {key && <h1>Your share key is: {key}</h1>}
      </div>
    );
  }
}

export default ShareFlight;
