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
 Router.delete('/delete-booking',async (req,res)=>{
await bookintModel.deleteMany();
console.log("deleted");
 }) 
Router.use(authController.isProtect);
Router.post("/create-booking", bookingController.createBooking);
Router.post("/create-checkout-session", bookingController.createCheckout);

Router.post("/cancel-appoinment", bookingController.cancelAppoinment);

Router.get("/get-user-appoinments", bookingController.getAppoinmentsForUser);
Router.get(
  "/get-doctor-appoinments",
  bookingController.getAppoinmentsForDoctor
);
Router.post("/set-appoinment", bookingController.setAppoinmentByDoctor);
module.exports = Router;
