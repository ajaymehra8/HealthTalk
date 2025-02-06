import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Box, useToast } from "@chakra-ui/react";
import moment from "moment";
import { useAuthState } from "../../../context/AuthProvider";
import axios from "axios";

const AppoinmentCard = ({ appoinment, appoinments, setAppoinments }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [appoinmentf, setAppoinment] = useState(appoinment);
  const createdAt = appoinmentf?.createdAt; // ISO string from DB
  const toast = useToast();
  const { user } = useAuthState();
  const [acceptLoading, setAcceptLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);
  const timeAgo = createdAt ? moment(createdAt).fromNow() : "Unknown";

  // Initialize `selectedDate` when the component mounts
  useEffect(() => {
    if (appoinmentf?.time) {
      setSelectedDate(new Date(appoinment.time)); // Convert ISO string to Date
    }
  }, [appoinmentf]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const cancelAppoinment = async () => {
    const body = {
      appoinmentId: appoinment._id,
    };
    setRejectLoading(true);
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/v1/booking/cancel-appoinment`,
        body,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${user?.jwt}`,
          },
        }
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
    } catch (error) {
      console.error("Error canceling appointment:", error);
      toast({
        title: "An error occurred",
        description: error.message,
        status: "error",
        isClosable: true,
        duration: 5000,
        position: "top",
      });
    }
    setRejectLoading(false);
  };

  const setAppoinmentByDoc = async () => {
    if (!selectedDate) {
      toast({
        title: "Please select a valid date",
        status: "error",
        isClosable: true,
        duration: 5000,
        position: "top",
      });
      return;
    }
    setAcceptLoading(true);
    try {
      const token = user?.jwt;
      if (!token) return;

      const body = {
        appoinmentId: appoinment._id,
        time: selectedDate, // Send the selectedDate directly
      };

      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/v1/booking/set-appoinment`,
        body,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        // Update `selectedDate` with the updated appointment time
        setSelectedDate(new Date(data.appoinment.time));
        setAppoinment(data?.appoinment);
        toast({
          title: "Appointment updated successfully",
          status: "success",
          isClosable: true,
          duration: 5000,
          position: "top",
        });
      } else {
        toast({
          title: data.message || "Failed to set appointment",
          status: "error",
          isClosable: true,
          duration: 5000,
          position: "top",
        });
      }
    } catch (error) {
      console.error("Error setting appointment:", error);
      toast({
        title: "An error occurred",
        description: error.message,
        status: "error",
        isClosable: true,
        duration: 5000,
        position: "top",
      });
    }
    setAcceptLoading(false);
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
    >
      {" "}
      <Box
        display={"flex"}
        flexDir={"column"}
        justifyContent={"center"}
        width={"clamp(190px,25%,200px)"}
        alignItems={"center"}
      >
        <img src={appoinmentf?.user?.image} alt="" className="rectangle-img" style={{height:"clamp(150px,5vh,200px)"}}/>
        <h4 style={{ alignSelf: "center" }}>
          Mr. {appoinmentf?.user?.name || "Unknown User"}
        </h4>
      </Box>
      <Box>
        <h2>Payment: {appoinmentf?.payment ? "Paid" : "Unpaid"}</h2>
        <h2>Time: {timeAgo}</h2>
        <h2>Mode: {appoinmentf?.mode || "Offline"}</h2>
        <DatePicker
          selected={selectedDate} // Updated state for the date picker
          onChange={handleDateChange} // Function to handle date changes
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={15}
          dateFormat="MM/dd/yyyy h:mm aa"
          placeholderText="Select date and time"
          className="date-picker-input"
          disabled={appoinmentf?.time} // Disable if appointment already has a time
        />
        <div
          className="reqButtons"
          style={{ width: "100%", gap: "10px", marginTop: "20px" }}
        >
          <button
            className="acceptBtn"
            onClick={!appoinmentf?.time ? setAppoinmentByDoc : undefined}
          >
            {!acceptLoading
              ? !appoinmentf?.time
                ? "Set"
                : "Scheduled"
              : "Wait..."}
          </button>

          {!appoinmentf?.time && (
            <button className="rejectBtn" onClick={!rejectLoading?cancelAppoinment:undefined}>
              {!rejectLoading ? "Cancel" : "Wait..."}
            </button>
          )}
        </div>
      </Box>
    </Box>
  );
};

export default AppoinmentCard;
