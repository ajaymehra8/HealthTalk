import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { Box, Text, useToast } from "@chakra-ui/react";
import { useAuthState } from "../../../context/AuthProvider";

const WebInfo = () => {
  const { user } = useAuthState();
  const [doctorCount, setDoctorCount] = useState();
  const [userCount, setUserCount] = useState();
  const [appoinmentsCount, setAppoinmentCount] = useState();
  const toast = useToast();
  const getDetails = useCallback(async () => {
    try {
      if (!user) {
        return;
      }
      const token = user?.jwt;
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/user/get-website-details`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(data);
      if (data?.success) {
        setDoctorCount(data?.doctors);
        setUserCount(data?.users);
        setAppoinmentCount(data?.appoinments);
      } else {
        toast({
          title: data?.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      }
    } catch (err) {
      toast({
        title: err.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
  }, [user]);
  useEffect(() => {
    getDetails();
  }, [getDetails]);
  return (
    <Box
      display={"flex"}
      gap={"30px"}
      width={"100%"}
      height={"80%"}
      justifyContent={"space-evenly"}
    >
      <Box
        width={"27%"}
        height={"50%"}
        bg={"white"}
        borderRadius={"20px"}
        color={"black"}
        p={"20px 10px"}
      >
        <Text fontSize={"clamp(20px,5vw,30px)"} fontWeight={400}>
          Total Doctors : <span style={{ fontWeight: 500 }}>{doctorCount}</span>
        </Text>
      </Box>
      <Box
        width={"27%"}
        height={"50%"}
        bg={"white"}
        borderRadius={"20px"}
        color={"black"}
        p={"20px 10px"}
      >
        <Text fontSize={"clamp(20px,5vw,30px)"} fontWeight={400}>
          Total Users :<span style={{ fontWeight: 500 }}>{userCount}</span>
        </Text>
      </Box>
      <Box
        width={"27%"}
        height={"50%"}
        bg={"white"}
        borderRadius={"20px"}
        color={"black"}
        p={"20px 10px"}
      >
        <Text fontSize={"clamp(20px,5vw,30px)"} fontWeight={400}>
          Appoinments :
          <span style={{ fontWeight: 500 }}>{appoinmentsCount}</span>
        </Text>
      </Box>
    </Box>
  );
};

export default WebInfo;
