import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { useAuthState } from "../../context/AuthProvider";
import AppoinmentCard from "./Appoinment/AppoinmentCard";
import { Box } from "@chakra-ui/react";

const UserAppoinments = () => {
  const [appoinments, setAppoinments] = useState([]);
  const { user } = useAuthState();
  const token = user?.jwt;

  const headers = {
    "Content-Type": "application/json",
    authorization: `Bearer ${token}`,
  };

  const getAppoinments = useCallback(async () => {
    if (!token) return;
    const { data } = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/v1/booking/get-user-appoinments`,
      { headers }
    );
    setAppoinments(data.bookings);
  }, [token]);

  useEffect(() => {
    getAppoinments();
  }, [getAppoinments]);
  return (
    <Box
      display={"flex"}
      flexDir={"column"}
      alignItems={"start"}
      justifyContent={"start"}
      w={"clamp(400px,80%,1000px)"}
      minH={"85vh"}
      maxH={"85vh"}
      p={"25px"}
      pt={"15px"}
      bg={"white"}
      borderRadius={"10px"}
      pb={"30px"}
      boxShadow={"1px 1px 10px 4px #686d77"}
      overflowY={"auto"}
      gap={"20px"}
      sx={{
        "@media(max-width:500px)":{
          maxHeight:"63vh",
          minHeight:"63vh"
        }
      }}
    >
      {appoinments.length > 0 && (
        <h1 className="page-head">Your All Appoinments</h1>
      )}
      {appoinments.length > 0 ? (
        appoinments.map((appoinment) => (
          <AppoinmentCard
            appoinment={appoinment}
            setAppoinments={setAppoinments}
            appoinments={appoinments}
          />
        ))
      ) : (
        <h1 className="no-item-text">No appoinments</h1>
      )}
    </Box>
  );
};

export default UserAppoinments;
