const express = require("express");
const serverless = require("serverless-http");
const moment = require("moment-timezone");

const app = express();
const router = express.Router();

// so that your API is remotely testable by FCC
var cors = require("cors");
app.use(cors({ optionsSuccessStatus: 200 })); // some legacy browsers choke on 204

// Check if date is valid
const checkValidDate = (date) => {
  var dateFormat1 = "YYYY-MM-DD";
  return (
    moment(date, dateFormat1, true).isValid() ||
    moment(parseInt(date)).utc().format("ddd, D MMM YYYY HH:mm:ss") !==
      "Invalid date"
  );
};

const handleUnixDate = (date) => {
  let unixValue = date;
  unixDate = convertUnixDate(date);
  let utcValue = moment(unixDate, "YYYY-MM-DD hh:mm:ss").format(
    "ddd, DD MMM YYYY HH:mm:ss"
  );
  return [unixValue, utcValue];
};
// convert timestamp Format to
// YYYY-MM-DD HH:mm:ss Format
const convertUnixDate = (date) => {
  let dateFromString = new Date(parseInt(date));
  return moment
    .utc(dateFromString)
    .tz("Atlantic/Reykjavik")
    .format("YYYY-MM-DD HH:mm:ss");
};

// Get current Date
router.get("/:date", (req, res) => {
  let inputDate = req.params.date;
  let unixValue;
  let utcValue;
  if (checkValidDate(inputDate)) {
    if (!inputDate.includes("-")) {
      dateValues = handleUnixDate(inputDate);
      unixValue = dateValues[0];
      utcValue = dateValues[1];
    } else {
      let convertedDate = moment.utc(inputDate).tz("Atlantic/Reykjavik");
      unixValue = moment(convertedDate, "YYYY-MM-DD").format("x");
      utcValue = moment(convertedDate, "YYYY-MM-DD").format(
        "ddd, DD MMM YYYY HH:mm:ss"
      );
    }
    res.json({ unix: unixValue, utc: utcValue + " GMT" });
  } else {
    res.json({ error: "Invalid Date" });
  }
});

// Default Route
router.get("/", (req, res) => {
  let unixValue = moment.utc().tz("Atlantic/Reykjavik").format("x");
  let utcValue = moment
    .utc()
    .tz("Atlantic/Reykjavik")
    .format("ddd, DD MMM YYYY HH:mm:ss");
  res.json({ unix: unixValue, utc: utcValue + " GMT" });
});

app.use(`/.netlify/functions/api`, router);

module.exports = app;
module.exports.handler = serverless(app);
