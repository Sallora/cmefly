import React, { Component } from "react";

class ShareFlight extends Component {
  state = {
    isSharing: false
  };

  shareFlight(flightId) {
    fetch(`http://localhost:5000/finaljs-c5415/us-central1/ShareFlight`, {
      method: "POST",
      body: JSON.stringify({ flightId })
    }).then(response => {
      console.log("flight was shared");
    });
  }

  render() {
    const { flightId } = this.props;

    return (
      <div className="share-flight">
        <h2>The flight you want to share is: {flightId}</h2>
        <button onClick={() => this.shareFlight(flightId)}>
          Share this flight
        </button>
      </div>
    );
  }
}

export default ShareFlight;
