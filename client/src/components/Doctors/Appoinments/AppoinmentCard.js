import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Box } from "@chakra-ui/react";
import moment from "moment";

const AppoinmentCard = ({ appoinment }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const createdAt = appoinment?.createdAt; // Assume ISO string from DB

  const timeAgo = createdAt ? moment(createdAt).fromNow() : "Unknown";
  const handleDateChange = (date) => {
    setSelectedDate(date);
    console.log(`Selected date for ${appoinment?.user?.name}:`, date);
  };

  return (
    <div
      style={{
        padding: "10px",
        margin: "10px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        display: "flex",
        justifyContent: "start",
        alignItems: "start",
        width: "97%",
        gap:"7%",
        background:"#f0f0f0"

      }}
    >
      <Box
        display={"flex"}
        flexDir={"column"}
        justifyContent={"center"}
        width={"25%"}
        alignItems={"center"}
      >
        <img src={appoinment?.user?.image} alt="" className="rectangle-img" />
        <h4 style={{ alignSelf: "center" }}>
          Mr. {appoinment?.user?.name || "Unknown User"}
        </h4>
      </Box>
      <Box>
        <h2>Payment: {appoinment?.payment?"Paid":"Unpaid"}</h2>
        <h2>Time: {timeAgo}</h2>
        <h2>Mode: {appoinment?.mode || "Offline"}</h2>
      <DatePicker
        selected={selectedDate} // Controlled state for the date picker
        onChange={handleDateChange} // Function to handle date changes
        showTimeSelect // Enables time selection
        timeFormat="HH:mm" // Time format
        timeIntervals={15} // Time intervals in minutes
        dateFormat="MM/dd/yyyy h:mm aa" // Use MM for numeric month
        placeholderText="Select date and time"
        className="date-picker-input" // Optional: Add custom styling
      
      />
      <div className="reqButtons" style={{width:"100%",gap:"10px",marginTop:"20px"}}>
      <button className="acceptBtn" >
          Set Appoinment
        </button>
        <button className="rejectBtn" >
          Cancel Appoinment
        </button>
      </div>
      </Box>
    </div>
  );
};

export default AppoinmentCard;
