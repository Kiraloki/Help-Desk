"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const { urlencoded, json } = require("body-parser");

const app = express().use(bodyParser.json());

app.post("/webhook", (req, res) => {
  let body = req.body;

  console.log(`\u{1F7EA} Received webhook:`);
  console.dir(body, { depth: null });

  if (body.object === "page") {
    // Returns a '200 OK' response to all requests
    res.status(200).send("EVENT_RECEIVED");

    // Determine which webhooks were triggered and get sender PSIDs and locale, message content and more.
  } else {
    // Return a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }
});

app.get("/webhook", (req, res) => {
  // Parse the query params
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];
  console.log("1");

  // Check if a token and mode is in the query string of the request
  if (mode && token) {
    console.log("2");

    // Check the mode and token sent is correct
    if (
      mode === "subscribe" &&
      token ===
        "EAALd9UmURjkBO6tBejsd3sq9eJFZATOkZBgBcRhLE2RmFJ3m8PrJBzZBGSD2F2y6O5J2ToKWQO7hHmxix6UCEhCMwoISmt8DVwUq34DwqFswI87hBZCZCPDx1oNSxEI4WQZCLIvTiEHV27WiWBy7zZBCTFRXZB7z79MLIHgUHs7LJiUgrZByLz89xpYYS2hCbdlgJTs4GiSTaIZA6FpbrM1tj6gejRQZCx67X5ffB4ZD"
    ) {
      // Respond with the challenge token from the request
      console.log("3");

      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
      console.log("4");
    } else {
      // Respond with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
      console.log("5");
    }
  }
});

// Verify that the callback came from Facebook.
function verifyRequestSignature(req, res, buf) {
  var signature = req.headers["x-hub-signature-256"];

  if (!signature) {
    console.warn(`Couldn't find "x-hub-signature-256" in headers.`);
  } else {
    var elements = signature.split("=");
    var signatureHash = elements[1];
    var expectedHash = crypto
      .createHmac("sha256", config.appSecret)
      .update(buf)
      .digest("hex");
    if (signatureHash != expectedHash) {
      throw new Error("Couldn't validate the request signature.");
    }
  }
}

app.listen(4000);
