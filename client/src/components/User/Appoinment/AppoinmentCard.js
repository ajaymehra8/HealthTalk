import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Avatar, Tooltip, useToast } from "@chakra-ui/react";
import { useAuthState } from "../../../context/AuthProvider";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";

const AppoinmentCard = ({ appoinment, setAppoinments, appoinments }) => {
  const { user } = useAuthState();
  const navigate = useNavigate();
  const toast = useToast();
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
      `http://localhost:8000/api/v1/booking/create-checkout-session`,
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
      `http://localhost:8000/api/v1/booking/cancel-appoinment`,
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
      gap={"10px"}
      justifyContent={"space-between"}
      alignItems={"center"}
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
        width={"40%"}
        justifyContent={"start"}
        alignItems={"center"}
        gap={"40px"}
        zIndex="10"
      >
        <Avatar
          size="md"
          name={appoinment.doctor?.name}
          src={appoinment.doctor?.image}
        />
        <h2 style={{ fontSize: "20px" }}>Dr. {appoinment.doctor?.name}</h2>
      </Box>
      <div className="reqButtons">
        <button className="acceptBtn" onClick={handlePayment}>
          Pay ₹{appoinment.doctor?.onlineFee || 1000}
        </button>
        <button className="rejectBtn" onClick={handleDelete}>
          Cancel
        </button>
        <Tooltip label="See details" placement="bottom">
          <button
            onClick={() => {
              console.log(appoinment)
              const doctor = { ...appoinment.doctor };
              navigate("/doctor-profile", { state: { user: doctor } });
            }}
          >
            <i class="bi bi-eye"></i>
          </button>
        </Tooltip>
      </div>
    </Box>
  );
};

export default AppoinmentCard;
