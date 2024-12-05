import React, { useState, useEffect, useCallback } from "react";
import { useAuthState } from "../../../context/AuthProvider";
import axios from "axios";
import { Box } from "@chakra-ui/react";
import AppoinmentCard from "./AppoinmentCard";

const Appoinments = () => {
  const { user,headers } = useAuthState();
  const [appoinments, setAppoinments] = useState([]);
  

  const fetchAppoinments = useCallback(async () => {
    if (!headers) return; // Ensure token is available before making the API call
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/booking/get-doctor-appoinments`,
        {
          headers
        }
      );
      if (data.success) {
        setAppoinments(data.bookings);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error.message);
    }
  }, [headers]);

  useEffect(() => {
    fetchAppoinments();
  }, [fetchAppoinments]);

  return (
    <Box
      display={"flex"}
      flexDir={"column"}
      alignItems={"center"}
      justifyContent={"start"}
      w={"70%"}
      minH={"80vh"}
      maxH={"80vh"}
      p={"20px"}
      pt={"10px"}
      bg={"white"}
      borderRadius={"10px"}
      pb={"30px"}
      boxShadow={"1px 1px 10px 4px #686d77"}
      overflowY={"auto"}
    >
            <h1 className="page-head">Your All Appoinments</h1>

      {appoinments.length > 0 ? (
        appoinments.map((appoinment) => (
          <AppoinmentCard key={appoinment.id} appoinment={appoinment} />
        ))
      ) : (
        <h1 className="no-item-text">No appointments</h1>
      )}
    </Box>
  );
};

export default Appoinments;
