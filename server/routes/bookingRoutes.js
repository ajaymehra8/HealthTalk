const express=require("express");
const Router=express.Router();
const bookingController=require("../controller/bookingController");
const authController=require('../controller/authController');
Router.use(authController.isProtect);
Router.post("/create-booking",bookingController.createBooking);
Router.post("/create-checkout-session",bookingController.createCheckout);
Router.post("/cancel-appoinment",bookingController.cancelAppoinment);

Router.get("/get-user-appoinments",bookingController.getAppoinmentsForUser);
Router.get("/get-doctor-appoinments",bookingController.getAppoinmentsForDoctor);
Router.post("/set-appoinment",bookingController.setAppoinmentByDoctor)
module.exports=Router; 