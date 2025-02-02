import React, { useState,useEffect } from "react";
import { useAuthState } from "../../context/AuthProvider";
import { Box } from "@chakra-ui/react";
import ReqCard from "../Approval/ReqCard";
import axios from 'axios';
const Approvals = () => {
  const { user } = useAuthState();
  const [reqs,setReqs]=useState(null);
  const fetchReqs = async () => {
    const token = user?.jwt;
  
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/user/request`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
          },
        }
      );
  
      if (data.success) {
        setReqs(data?.reqs);
        console.log(reqs);
      }
    } catch (error) {
      console.error("Error fetching requests:", error.response?.data || error.message);
    }
  };
  
  useEffect(()=>{
fetchReqs();
  },[user])
  return (
    <Box
      display={"flex"}
      flexDir={"column"}
      alignItems={"start"}
      justifyContent={"start"}
      w={"clamp(400px,80%,1000px)"}
      minH={"84vh"}
      maxH={"85vh"}
      p={"20px"}
      pt={"40px"}
      bg={"white"}
      borderRadius={"10px"}
      pb={"30px"}
      boxShadow={"1px 1px 10px 4px #686d77"}
      overflowY={"auto"}
      gap={"20px"}
      sx={{
        "@media(max-width:500px)": {
          maxHeight: "63vh",
          minHeight: "63vh",
        },
      }}
    >
      {reqs?.length > 0 ? (
        reqs?.map((req) => <ReqCard req={req} setReqs={setReqs}/>)
      ) : (
        <h1 className="no-item-text">No Requests Yet.</h1>
      )}
    </Box>
  );
};

export default Approvals;
