const express = require("express");
const router = express.Router();
// const structjson = require('./structjson.js');
const dialogflow = require("dialogflow");
const { Client } = require("../models/Opinion");
// const uuid = require('uuid');

const config = require("../config/keys");

const projectId = config.googleProjectID;
const sessionId = config.dialogFlowSessionID;
const languageCode = config.dialogFlowSessionLanguageCode;

// Create a new session
const sessionClient = new dialogflow.SessionsClient();
const sessionPath = sessionClient.sessionPath(projectId, sessionId);

// We will make two routes

// Text Query Route
let name;
let email;
router.post("/textQuery", async (req, res) => {
  //We need to send some information that comes from the client to Dialogflow API
  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        // The query to send to the dialogflow agent
        text: req.body.text,
        // The language used by the client (en-US)
        languageCode: languageCode,
      },
    },
  };
  // const opinion = new Opinion({name:req.body.text});
  // opinion.save();

  // Send request and log result
  const responses = await sessionClient.detectIntent(request);
  console.log("Detected intent");
  console.log(responses);
  if (
    responses[0].queryResult.action === "clientInfo" &&
    responses[0].queryResult.fulfillmentText === "Whats your email?" &&
    responses[0].queryResult.intentDetectionConfidence === 1
  ) {
    name = responses[0].queryResult.queryText;
  }
  if (
    responses[0].queryResult.action === "clientInfo" &&
    responses[0].queryResult.allRequiredParamsPresent &&
    responses[0].queryResult.intentDetectionConfidence === 1
  ) {
    email = responses[0].queryResult.queryText;
    const client = new Client({ name, email });
    client.save();
  }

  const result = responses[0].queryResult;
  // console.log(`  Query: ${result.queryText}`);
  // console.log(`  Response: ${result.fulfillmentText}`);

  res.send(result);
});

//Event Query Route

router.post("/eventQuery", async (req, res) => {
  //We need to send some information that comes from the client to Dialogflow API
  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      event: {
        // The query to send to the dialogflow agent
        name: req.body.event,
        // The language used by the client (en-US)
        languageCode: languageCode,
      },
    },
  };

  // Send request and log result
  const responses = await sessionClient.detectIntent(request);
  const result = responses[0].queryResult;

  res.send(result);
});

module.exports = router;
