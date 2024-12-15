const express = require("express");
const authoController = require("../controller/authController");
const reportController = require("../controller/reportController");
const Router = express.Router();

Router.use(authoController.isProtect);

Router.route("/")
  .post(reportController.createReport)
  .get(reportController.getAllReports);

module.exports = Router;
