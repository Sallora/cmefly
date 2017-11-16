import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

class App extends Component {
  constructor() {
    super();
    this.state = {
      flights: []
    };
  }
  componentDidMount() {
    // this.setState({
    //   flights: firebase.get('flights'),
    // });
    const myHeaders = new Headers();
    myHeaders.append("Access-Control-Allow-Origin", "*");

    const myInit = {
      method: "GET",
      headers: myHeaders,
      mode: "cors",
      cache: "default"
    };

    window
      .fetch(
        "https://us-central1-finaljs-c5415.cloudfunctions.net/GetFlightDetails?tailNumber=BAW4600"
      )
      .then(response => {
        console.log("response", response);
        this.setState({
          flights: response
        })
      })
      .catch(err => {
        console.log("error", err);
      });
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">CMEFLY</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <h2
          style={{
            color: "red"
            backgroundColor: "blue",
            marginBottom: "20px"
          }}
        >
        <button className="btn btn-primary"></button>
          Flights
        </h2>
        <ul>
          {this.state.flights.map(flight => {
            <li>{flight.name}</li>
          })}
        </ul>
      </div>
    );
  }
}

export default App;
