import React, { Component } from "react";

class ShareFlight extends Component {
  state = {
    isSharing: false,
    key: null
  };

  shareFlight(flightId) {
    this.setState({ isSharing: true });
    fetch(`${process.env.REACT_APP_ENDPOINT}/ShareFlight`, {
      method: "POST",
      body: JSON.stringify({ flightId })
    })
      .then(response => response.json())
      .then(data => this.setState({ ...data, isSharing: false }));
  }

  render() {
    const { flightId } = this.props;
    const { key, url, isSharing } = this.state;

    return (
      <div className="share-flight">
        <p>
          The flight you want to share is: <strong>{flightId}</strong>
        </p>
        <button
          className="btn-lg btn-primary"
          onClick={() => this.shareFlight(flightId)}
        >
          {isSharing ? "Generating share link..." : "Share this flight"}
          <span className="ml-2">🔗</span>
        </button>
        {key && (
          <div className="alert alert-success mt-3">
            Your share key is: <strong>{url}</strong>
          </div>
        )}
      </div>
    );
  }
}

export default ShareFlight;
