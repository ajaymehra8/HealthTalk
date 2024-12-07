const stripe = require("stripe")(process.env.STRIPE_SECRET);
const BookingModel = require("../model/bookingModel");
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
    console.log(bookings);
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
    });

    // Update booking record
    const booking = await BookingModel.findByIdAndUpdate(
      appoinmentId,
      { payment: true },
      { new: true }
    );

    // Respond with success and session details
    res.status(200).json({
      success: true,
      message: "Payment session created successfully",
      booking,
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
  console.log(req.body);
  const { time, appoinmentId } = req.body;
  console.log("set appoinment");
  console.log(time, appoinmentId);
  if (!appoinmentId || !time) {
    return res.status(400).json({ success: false, message: "Invalid data" });
  }
  try {
    const appoinment = await BookingModel.findByIdAndUpdate(
      appoinmentId,
      { time: new Date(time) },
      { new: true }
    ).populate({path:"user",select:"-password -__v"});

    res.status(200).json({
      success: true,
      appoinment,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
