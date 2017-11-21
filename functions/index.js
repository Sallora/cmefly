const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);
const request = require("request-promise");

/*
 * Environmental variables
 * ---
 * These are our app configuration variables stored as environmentals
 * (reference here: https://firebase.google.com/docs/functions/config-env)
 * If the variable is not set, it falls back to default (useful for local development)
 */
const config = functions.config().cmefly || {};
const API_ENDPOINT =
  config.API_ENDPOINT || "https://flightxml.flightaware.com/json/FlightXML3";
const API_KEY = config.API_KEY || "salomidoulora";
const API_SECRET =
  config.API_SECRET || "cffde6e3dd2793be4e7864dd7ff8114d16a66abd";
const DOMAIN = config.DOMAIN || "http://localhost:3000";
const GOOGLE_API_KEY =
  config.GOOGLE_API_KEY || "AIzaSyB5MaKxVvckCfSqf1tqeG4O5IfMfEvgAx4";

/*
 * Fetch Flights
 * ---
 * Request flight data from the the FlightAware API
 * params: a valid flight tail number e.g: BAW4600
 */
function fetchFlights(tailNumber) {
  return request(`${API_ENDPOINT}/FlightInfoStatus`, {
    method: "POST",
    formData: {
      ident: tailNumber
    },
    auth: {
      user: API_KEY,
      pass: API_SECRET
    },
    json: true
  });
}

/*
 * Firebase https functions
 * ---
 *
 * https://firebase.google.com/docs/functions/http-events
 * Note: Firebase uses express under the hood for serving http functions
 * so the request and response objects documentation can be found here:
 *
 * Request: http://expressjs.com/en/4x/api.html#req
 * Response: http://expressjs.com/en/4x/api.html#res
 */
exports.GetFlightDetails = functions.https.onRequest((request, response) => {
  response.set("Access-Control-Allow-Origin", "*");
  response.set("Access-Control-Allow-Methods", "GET, POST");

  // Check that we have a tail number from the request
  const tailNumber = request.query.tailNumber;
  if (!tailNumber) {
    // The tail number parameter was missing, so return a 422 response (unprocessable entity)
    return response.status(422).send("Missing 'tailNumber' query parameter");
  }

  // Call the fetch flights method with our tailNumber, which returns a promise
  fetchFlights(tailNumber)
    .then(flightData => {
      // Note: 'flightData' variable is the response of our request to the Flightaware API
      // 1. Check if we have any valid flight data...
      const flightsArray = flightData["FlightInfoStatusResult"];
      if (!"flights" in flightsArray) {
        return response.send(
          `No flight with tail number '${tailNumber}' found`
        );
      }

      // Retrieve the latest flight from the array (the others are old)
      response
        .type("json")
        .status(200)
        .send(flightData);
    })
    .catch(error => {
      // If something went wrong (such as an invalid tail number), return a normalised response
      // this is to prevent the function 'crashing' and messing up the logs on Firebase. It's
      // always good to handle errors in a tidy way when they can happen often.
      return response
        .status(500)
        .send(
          `Unable to retrieve flight with tail number '${tailNumber}' found`
        );
    });
});

/*
 * Shorten URL
 * ---
 * Use Google's URL shortening API to take our long database key
 * and shorten it into something shareable
 */
function getShortUrl(url) {
  return request(
    `https://www.googleapis.com/urlshortener/v1/url?key=${GOOGLE_API_KEY}`,
    {
      method: "POST",
      json: true,
      body: { longUrl: url }
    }
  );
}

/*
 * Log a flight and notify watcher
 * ---
 * Explanation incoming
 */
exports.ShareFlight = functions.https.onRequest((request, response) => {
  response.set("Access-Control-Allow-Origin", "*");
  response.set("Access-Control-Allow-Methods", "GET, POST");

  // Parse the request body from JSON to Javascript
  const jsonData = JSON.parse(request.body);

  // Ensure there is a flight ID
  if (!"flightId" in jsonData) {
    return response.status(422).send("No flight ID was sent to the function");
  }

  const flightId = jsonData.flightId;

  // Write to the database
  const dbRow = admin
    .database()
    .ref(`/flights/`)
    .push({
      flightId: flightId,
      date_created: new Date()
    });

  // Shorten the URL
  getShortUrl(`${DOMAIN}/${dbRow.key}`).then(shortUrl => {
    return response
      .status(200)
      .send(JSON.stringify({ key: dbRow.key, url: shortUrl.id }));
  });
});
