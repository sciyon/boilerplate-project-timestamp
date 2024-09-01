// index.js
// where your node app starts

// init project
var express = require("express");
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require("cors");
app.use(cors({ optionsSuccessStatus: 200 })); // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/views/index.html");
});

// your first API endpoint...
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.get("/api/:date?", function (req, res) {
  //if param are empty, them use current date.
  if (!req.params.date) {
    var dateUnix = Date.now().valueOf();
    var dateUTC = new Date().toUTCString();
    res.json({
      unix: dateUnix,
      utc: dateUTC,
    });
  } else {
    const { date } = req.params;
    const isNumber = !isNaN(parseFloat(date)) && isFinite(date);
    var dataToParseDate = isNumber ? parseInt(date) : date;

    if (!Date.parse(new Date(dataToParseDate))) {
      res.status(400).json({
        error: "Invalid Date",
      });
    }

    var unix = new Date(dataToParseDate).valueOf();
    var utc = new Date(dataToParseDate).toUTCString();

    res.json({
      unix: unix,
      utc: utc,
    });
  }
});

app.get("/api/whoami", function (req, res) {
  const ipaddress = req.ip;
  const language = req.headers["accept-language"];
  const software = req.headers["user-agent"];

  res.json({
    ipaddress: ipaddress,
    language: language,
    software: software,
  });
});

//REST api shorturl
const mapUrl = new Map();
var idUrl = 1;

app.post("/api/shorturl/:url?", function (req, res) {
  console.log(req.body);

  if (!req.body.url) {
    res.status(400).json({
      error: "invalid url",
    });
  }

  const myUrl = req.body.url;
  const isIdUrl = !isNaN(parseFloat(myUrl)) && isFinite(myUrl);

  if (!isIdUrl) {
    if (!isURL(myUrl)) {
      res.status(400).json({
        error: "invalid url",
      });
    }
    mapUrl.set(idUrl, myUrl);
  } else {
    const myRedirect = mapUrl.get(parseInt(myUrl));

    if (myRedirect) {
      res.redirect(myRedirect);
    }

    res.status(400).json({
      error: "invalid url",
    });
  }

  console.log(mapUrl);

  res.json({
    original_url: myUrl,
    short_url: idUrl++,
  });
});

app.get("/api/shorturl/:url?", function (req, res) {
  if (!req.params.url) {
    res.status(400).json({
      error: "invalid url",
    });
  }

  const myUrl = req.params.url;
  const isIdUrl = !isNaN(parseFloat(myUrl)) && isFinite(myUrl);

  if (!isIdUrl) {
    res.status(400).json({
      error: "invalid url",
    });
  } else {
    const myRedirect = mapUrl.get(parseInt(myUrl));

    if (myRedirect) {
      res.redirect(myRedirect);
    }

    res.status(400).json({
      error: "invalid url",
    });
  }
});

const isURL = (str) => {
  var pattern = new RegExp(
    "^((ft|htt)ps?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name and extension
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?" + // port
      "(\\/[-a-z\\d%@_.~+&:]*)*" + // path
      "(\\?[;&a-z\\d%@_.,~+&:=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  return pattern.test(str);
};

app.post("/api/name", function (req, res) {
  // Handle the data in the request
  var string = req.body.first + " " + req.body.last;
  res.json({ name: string });
});

// listen for requests :)
// var listener = app.listen(process.env.PORT, function () {
//   console.log('Your app is listening on port ' + listener.address().port);
// });

// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
