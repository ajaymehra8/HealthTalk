import React, { useState,useEffect } from "react";
import { useAuthState } from "../../context/AuthProvider";
import { Box } from "@chakra-ui/react";
import ReqCard from "../Approval/ReqCard";
import axios from 'axios';
const Approvals = () => {
  const { user } = useAuthState();
  const [reqs,setReqs]=useState([]);
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
    w={"clamp(320px,90%,1000px)"}
    minH={"85vh"}
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
      },
    }}
    >
      {reqs?.length > 0 && (
        <h1 className="page-head" style={{ marginBottom: "5px" }}>
          All Requests
        </h1>
      )}
      {reqs?.length > 0 ? (
        reqs?.map((req) => <ReqCard req={req} setReqs={setReqs}/>)
      ) : (
        <h1 className="no-item-text">No Requests Yet.</h1>
      )}
    </Box>
  );
};

export default Approvals;
