import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Avatar, Tooltip, useToast } from "@chakra-ui/react";
import { useAuthState } from "../../../context/AuthProvider";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AppoinmentCard = ({ appoinment, setAppoinments, appoinments }) => {
  const { user } = useAuthState();
  const [selectedDate, setSelectedDate] = useState(null);
  const navigate = useNavigate();
  const toast = useToast();
  console.log(appoinment?.doctor);

  const handlePayment = async () => {
    const stripe = await loadStripe(
      "pk_test_51QKM6JIu0DlivGoxIbEC0QON85mvDvjOLi1RB932paqnvBvWALpan0ZVhIzRHsFVg6S43HHQg7FFLsmzmRtS1qWW00V9RB4lFc"
    );
    const body = {
      doctor: appoinment.doctor,
      appoinmentId: appoinment._id,
    };
    const token = user?.jwt;

    const headers = {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    };
    const { data } = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/v1/booking/create-checkout-session`,
      body,
      { headers }
    );
    if (data.success) {
      const result = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });
      if (result.error) {
      }
      toast({
        title: data.message,
        status: "success",
        isClosable: true,
        duration: 5000,
        position: "top",
      });
    }
  };
  const handleDelete = async () => {
    const body = {
      appoinmentId: appoinment._id,
    };
    const token = user?.jwt;
    const headers = {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    };
    const { data } = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/v1/booking/cancel-appoinment`,
      body,
      { headers }
    );
    if (data.success) {
      setAppoinments((prevAppoinments) =>
        prevAppoinments.filter((appt) => appt._id !== appoinment._id)
      );
      toast({
        title: data.message,
        status: "success",
        isClosable: true,
        duration: 5000,
        position: "top",
      });
    }
  };
  return (
    <Box
      display={"flex"}
      width={"100%"}
      gap={"7%"}
      justifyContent={"start"}
      alignItems={"start"}
      border={"1px solid #d3d3d3"}
      borderRadius={"20px"}
      cursor={"pointer"}
      p={"5px 20px"}
      bg={"#f0f0f0"}
      transition={"transform .06s"}
      _hover={{
        transform: "scale(1.02)",
      }}
    >
      <Box
        display={"flex"}
        flexDir={"column"}
        justifyContent={"center"}
        width={"25%"}
        alignItems={"center"}
      >
        <img src={appoinment?.doctor?.image} alt="" className="rectangle-img" />
        <h4 style={{ alignSelf: "center" }}>
          Mr. {appoinment?.doctor?.name || "Unknown User"}
        </h4>
      </Box>
      <Box>
        <h2>Mode: {appoinment?.mode || "Offline"}</h2>
        <h2>Location: {appoinment?.doctor?.clinicLocation||"Delhi"}</h2>
        <Box>
          <h2>Time of Appoinment:</h2>
          <DatePicker
            selected={appoinment?.time?new Date(appoinment?.time):null} // Updated state for the date picker
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="MM/dd/yyyy h:mm aa"
            placeholderText="Appointment Not Settled."
            className="date-picker-input"
            disabled={true} // Disable if appointment already has a time
            style={{ marginTop: "80px" }} // Inline style for margin
          />
        </Box>
        <div
          className="reqButtons"
          style={{ width: "100%", gap: "15px", marginTop: "20px",justifyContent:'start' }}
        >
          <button className="acceptBtn" onClick={handlePayment}>
            {!appoinment?.payment
              ? `Pay $${appoinment.doctor?.onlineFee || "1000"}`
              : "Paid"}
          </button>
          <button className="rejectBtn" onClick={handleDelete}>
            Cancel
          </button>
        </div>
      </Box>
    </Box>
  );
};

export default AppoinmentCard;
