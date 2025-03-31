import React, { useState, useEffect, useCallback } from "react";
import { useAuthState } from "../../../context/AuthProvider";
import axios from "axios";
import { Box } from "@chakra-ui/react";
import AppoinmentCard from "./AppoinmentCard";

const Appoinments = () => {
  const { headers } = useAuthState();
  const [appoinments, setAppoinments] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAppoinments = useCallback(async () => {
    if (!headers) return; // Ensure token is available before making the API call
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/booking/get-doctor-appoinments`,
        {
          headers,
        }
      );
      if (data.success) {
        setAppoinments(data.bookings);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error.message);
    }
    setLoading(false);
  }, [headers]);

  useEffect(() => {
    fetchAppoinments();
  }, [fetchAppoinments]);

  return (
    <Box
    display={"flex"}
    flexDir={"column"}
    alignItems={"start"}
    justifyContent={"start"}
    w={"clamp(320px,90%,1000px)"}
    minH={"85vh"}
    maxH={"85vh"}
    height={'auto'}
          p={"2px 20px"}
          pt={'10px'}
          pb={'1vh'}
    bg={"white"}
    borderRadius={"10px"}
    boxShadow={"1px 1px 10px 4px #686d77"}
    sx={{
      "@media(max-width:500px)":{
        minHeight:"63vh",
        maxHeight:"63vh"
      },
    }}
    >
      {appoinments.length > 0 && (
        <h1 className="page-head">Your All Appoinments</h1>
      )}

      {!loading ? (
        appoinments.length > 0 ? (
          appoinments.map((appoinment) => (
            <AppoinmentCard
              key={appoinment.id}
              appoinment={appoinment}
              appoinments={appoinments}
              setAppoinments={setAppoinments}
            />
          ))
        ) : (
          <h1 className="no-item-text">No appointments</h1>
        )
      ) : (
        <h1 className="no-item-text">Loading...</h1>
      )}
    </Box>
  );
};

export default Appoinments;
