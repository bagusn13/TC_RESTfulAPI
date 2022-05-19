require("dotenv").config();

const db = require("./models");
const express = require("express");
const log = require("./logger");
const compression = require("compression");
const bodyParser = require("body-parser");

const app = express();
app.use(compression());

const routes = require("./routes");
const port = process.env.PORT_APP || 5000;

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.use("/api/", routes);
app.use("/api/upload", express.static("upload"));

app.listen(port, () => {
  log.logger.info(`RESTfulAPI is listening at http://localhost:${port}`);
  log.logger.info(`Database is connected`);
});
