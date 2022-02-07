require("dotenv").config();
const AdminJS = require("adminjs");
const AdminJSExpress = require("@adminjs/express");
const AdminJSSequelize = require("@adminjs/sequelize");
const db = require("./models");
const express = require("express");
const log = require("./logger");
const compression = require("compression");
const bodyParser = require("body-parser");

const app = express();
app.use(compression());

const routes = require("./routes");
const port = process.env.PORT_APP || 5000;

// // START ADMIN JS
// AdminJS.registerAdapter(AdminJSSequelize);
// const adminJs = new AdminJS({
//   databases: [db],
//   rootPath: "/admin",
//   branding: {
//     companyName: "TempatCukur.id",
//   },
// });

// const ADMIN = {
//   email: process.env.ADMIN_EMAIL || "noreply.tempatcukur@gmail.com",
//   password: process.env.ADMIN_PASSWORD || "CukurSukses99",
// };

// const router = AdminJSExpress.buildAuthenticatedRouter(adminJs, {
//   cookieName: process.env.ADMIN_COOKIE_NAME || "adminjs",
//   cookiePassword:
//     process.env.ADMIN_COOKIE_PASS ||
//     "supersecret-and-long-password-for-a-browser",
//   authenticate: async (email, password) => {
//     if (email === ADMIN.email && password === ADMIN.password) {
//       return ADMIN;
//     }
//     return null;
//   },
// });

// app.use(adminJs.options.rootPath, router);
// // END ADMIN JS

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
