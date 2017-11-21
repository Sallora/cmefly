import React, { Component } from "react";

class ShareFlight extends Component {
  state = {
    isSharing: false,
    key: null
  };

  shareFlight(flightId) {
    fetch(`${process.env.REACT_APP_ENDPOINT}/ShareFlight`, {
      method: "POST",
      body: JSON.stringify({ flightId })
    })
      .then(response => response.json())
      .then(data => this.setState({ ...data }));
  }

  render() {
    const { flightId } = this.props;
    const { key, url } = this.state;

    return (
      <div className="share-flight">
        <h2>The flight you want to share is: {flightId}</h2>
        <button onClick={() => this.shareFlight(flightId)}>
          Share this flight
        </button>
        {key && <h1>Your share key is: {url}</h1>}
      </div>
    );
  }
}

export default ShareFlight;
