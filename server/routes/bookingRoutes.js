const express = require("express");
const Router = express.Router();
const bookingController = require("../controller/bookingController");
const authController = require("../controller/authController");
const bookintModel=require("../model/bookingModel");
Router.post(
    "/webhook",
    express.raw({ type: "application/json" }),
    bookingController.webhook
  );
 
Router.use(authController.isProtect);
Router.post("/create-booking", bookingController.createBooking);
Router.post("/create-checkout-session", bookingController.createCheckout);
Router.get("/get-done-bookings",bookingController.getDoneAppoinmentForDoctor);

Router.post("/cancel-appoinment", bookingController.cancelAppoinment);

Router.get("/get-user-appoinments", bookingController.getAppoinmentsForUser);
Router.get(
  "/get-doctor-appoinments/:doctor",
  bookingController.getAppoinmentsForDoctor
);
Router.post("/set-appoinment", bookingController.setAppoinmentByDoctor);
module.exports = Router;
