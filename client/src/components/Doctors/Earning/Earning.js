import React, { useState, useEffect, useCallback } from "react";
import { useAuthState } from "../../../context/AuthProvider";
import axios from "axios";
import { Box } from "@chakra-ui/react";
import EarningCard from "./EarningCard";

const Earning = () => {
  const [appoinments, setAppoinments] = useState([]);
  const [income, setIncome] = useState(0);
  const [loading,setLoading]=useState(false);
  const { user } = useAuthState();
  const fetchAppoinments = useCallback(async () => {
    const token = user?.jwt;
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/booking/get-done-bookings`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      setAppoinments(data?.appoinments);
      setIncome(data?.totalIncome);
      setLoading(false);
    } catch (err) {
      console.log(err);
      alert(err);
      setLoading(false);
    }
  }, [user]);
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
      height={"auto"}
      p={"2px 20px"}
      pt={"10px"}
      pb={"1vh"}
      bg={"white"}
      borderRadius={"10px"}
      boxShadow={"1px 1px 10px 4px #686d77"}
      sx={{
        "@media(max-width:500px)": {
          minHeight: "63vh",
        },
      }}
    >
       {appoinments.length > 0 && (
        <h1 className="page-head">Your All Done Appoinments</h1>
      )}
      {!loading ? (
        appoinments?.length < 1 ? (
          <h1 className="no-item-text">No Earning Yet.</h1>
        ) : (
          <>
            {appoinments?.map((appoinment) => (
              <EarningCard appoinment={appoinment} />
            ))}
          </>
        )
      ) : (
        <h1 className="no-item-text">Loading...</h1>
      )}
    </Box>
  );
};

export default Earning;
