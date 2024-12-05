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
    const { data } = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/v1/booking/get-user-appoinments`,
      { headers }
    );
    setAppoinments(data.bookings);
  }, []);

  useEffect(() => {
    getAppoinments();
  }, [getAppoinments]);
  return (
    <Box
      display={"flex"}
      flexDir={"column"}
      alignItems={"start"}
      justifyContent={"start"}
      w={"70%"}
      minH={"80vh"}
      maxH={"80vh"}
      p={"20px"}
      pt={"40px"}
      bg={"white"}
      borderRadius={"10px"}
      pb={"30px"}
      boxShadow={"1px 1px 10px 4px #686d77"}
      overflowY={"auto"}
      gap={"20px"}
    >
      {appoinments.length>0 ? (
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
