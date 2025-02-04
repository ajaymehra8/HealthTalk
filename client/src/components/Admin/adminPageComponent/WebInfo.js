import { Box, Text, Flex } from "@chakra-ui/react";
import LineGraph from "../../graph/LineGraph";
import BarGraph from "../../graph/BarGraph";
import { useCallback, useEffect, useState } from "react";
import { useAuthState } from "../../../context/AuthProvider";
import axios from 'axios';
const WebInfo = () => {
  const [doctorCount,setDoctorCount]=useState(0);
  const [appoinmentsCount,setAppoinmentsCount]=useState(0);
  const [userCount,setUserCount]=useState(0);
  const {user}=useAuthState();

  const fetchDetails=useCallback(async()=>{
    try{
    const token=user?.jwt;
    if(!token) return;
const {data}=await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/user/get-website-details`,{
  headers:{
  'authorization':`Bearer ${token}`,
}});
if(data.success){
  setAppoinmentsCount(data?.appoinments);
  setDoctorCount(data?.doctors);
  setUserCount(data?.users);
}
    }catch(err){
      console.log(err);
      alert(err.message);
    }
  },[user]);

  useEffect(()=>{
 fetchDetails();
  },[fetchDetails]);

  return (
    <Flex
      gap="30px"
      width="100%"
      h={'auto'}
      justifyContent="center"
      alignItems={"center"}
      flexWrap="wrap" // Enables wrapping for responsiveness
      pb={'6px'}
    >
      {/* Card Boxes */}
      {[ 
        { title: "Total Doctors", count: doctorCount, graph: <LineGraph /> },
        { title: "Total Users", count: userCount, graph: <BarGraph /> },
        { title: "Appointments", count: appoinmentsCount, graph: <BarGraph /> },
        { title: "Total Payment", count: appoinmentsCount, graph: <BarGraph /> },
       


      ].map((item, index) => (
        <Box
          key={index}
          width={["clamp(250px,80%,300px)", "clamp(250px,45%,300px)", "clamp(250px,30%,300px)"]} // 1 box in small, 2 in medium, 3 in large screens
          height="230px"
          bg="white"
          borderRadius="20px"
          color="black"
          p="20px 10px"
          
        >
          <Text fontSize="clamp(20px,5vw,30px)" fontWeight={400}>
            {item.title} : <span style={{ fontWeight: 500 }}>{item.count}</span>
          </Text>
          {item.graph}
        </Box>
      ))}
    </Flex>
  );
};

export default WebInfo;
