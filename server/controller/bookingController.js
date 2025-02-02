const stripe = require("stripe")(process.env.STRIPE_SECRET);
const BookingModel = require("../model/bookingModel");

const updateBooking = async (appoinmentId) => {
  try {
    console.log(appoinmentId);
    // Update booking record
    const booking = await BookingModel.findByIdAndUpdate(
      appoinmentId,
      { payment: true },
      { new: true }
    );
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Unknow problem occur",
    });
  }
};

exports.createBooking = async (req, res, next) => {
  const { doctor } = req.body; // Get doctor name and fee from request body

  try {
    const booking = await BookingModel.create({
      user: req.user._id,
      doctor: doctor._id,
    });
    res.status(200).json({
      success: true,
      message: "Appoinment added!",
    });
  } catch (err) {
    next(err);
  }
};
exports.getAppoinmentsForUser = async (req, res, next) => {
  const userId = req.user._id;
  try {
    const bookings = await BookingModel.find({ user: userId }).populate({
      path: "doctor",
      select: "-password",
    });
    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (err) {
    next(err);
  }
};
exports.getAppoinmentsForDoctor = async (req, res, next) => {
  const userId = req.user._id;
  try {
    const bookings = await BookingModel.find({ doctor: userId }).populate({
      path: "user",
      select: "-password",
    });
    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (err) {
    next(err);
  }
};
// FUNCTION FOR CREATING CHECKOUT SESSION
exports.createCheckout = async (req, res, next) => {
  const { doctor, appoinmentId } = req.body;

  try {
    // Validate doctor details
    if (!doctor || !doctor.name) {
      return res.status(400).json({
        message: "Doctor details are missing or incomplete.",
      });
    }

    // Fallback for missing onlineFee
    const onlineFee = doctor.onlineFee || 1000;

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: req.user.email, // Ensure req.user.email is populated by auth middleware
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: doctor.name, // Doctor's name
            },
            unit_amount: Math.round(onlineFee * 100), // Fee in cents
          },
          quantity: 1, // Single charge
        },
      ],
      
      mode: "payment",
      success_url: "http://localhost:3000/my-profile/your-appoinment", // Corrected to use http
      cancel_url: "http://localhost:3000/my-profile/your-appoinment",
      metadata: {
        appointmentId: appoinmentId,
      },
    });

    // Respond with success and session details
    res.status(200).json({
      success: true,
      sessionId: session.id,
    });
  } catch (err) {
    console.error("Error in createCheckout:", err);
    res.status(500).json({
      message: "Failed to create checkout session",
      error: err.message,
    });
  }
};

// STRIPE WEBHOOK

exports.webhook = (request, response) => {
  const sig = request.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      request.body,
      sig,
      process.env.WEBHOOK_SECRET
    );
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }
  console.log("working");
  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const paymentIntentSucceeded = event.data.object;
      console.log("payment succeed");
      let session = event.data.object;
      console.log(session);
      console.log(session.metadata.appoinmentId);
      updateBooking(session.metadata.appoinmentId);
      // Then define and call a function to handle the event payment_intent.succeeded
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
};

// FUNCTION FOR DELETING APPOINMENT
exports.cancelAppoinment = async (req, res, next) => {
  const { appoinmentId } = req.body;
  try {
    await BookingModel.findByIdAndDelete(appoinmentId);
    res.status(200).json({
      success: true,
      message: "Appoinment canceled successfully",
    });
  } catch (err) {
    next(err);
  }
};

exports.setAppoinmentByDoctor = async (req, res, next) => {
  const { time, appoinmentId } = req.body;

  if (!appoinmentId || !time) {
    return res.status(400).json({ success: false, message: "Invalid data" });
  }
  try {
    const appoinment = await BookingModel.findByIdAndUpdate(
      appoinmentId,
      { time: new Date(time) },
      { new: true }
    ).populate({ path: "user", select: "-password -__v" });

    res.status(200).json({
      success: true,
      appoinment,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
