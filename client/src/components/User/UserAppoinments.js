import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { useAuthState } from "../../context/AuthProvider";
import AppoinmentCard from "./Appoinment/AppoinmentCard";
import { Box } from "@chakra-ui/react";

const UserAppoinments = () => {
  const [appoinments, setAppoinments] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuthState();
  const token = user?.jwt;



  const getAppoinments = useCallback(async () => {
    if (!token) return;
    const headers = {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    };
    setLoading(true);
    const { data } = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/v1/booking/get-user-appoinments`,
      { headers }
    );
    setAppoinments(data.bookings);
    setLoading(false);
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
    w={"clamp(320px,90%,1000px)"}
    minH={"85vh"}
    height={'auto'}
    gap={'20px'}
          p={"2px 20px"}
          pt={'10px'}
          pb={'1vh'}
    bg={"white"}
    borderRadius={"10px"}
    boxShadow={"1px 1px 10px 4px #686d77"}
    sx={{
      "@media(max-width:500px)":{
        minHeight:"63vh",
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
              appoinment={appoinment}
              setAppoinments={setAppoinments}
              appoinments={appoinments}
            />
          ))
        ) : (
          <h1 className="no-item-text">No appoinments</h1>
        )
      ) : (
        <h1 className="no-item-text">Loading...</h1>
      )}
    </Box>
  );
};

export default UserAppoinments;
