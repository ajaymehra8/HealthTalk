import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Avatar, Tooltip } from "@chakra-ui/react";
import {useAuthState} from "../../context/AuthProvider"
import axios from "axios";

const ReqCard = ({ req }) => {
  const {user}=useAuthState();
  const navigate=useNavigate();
  const handleAccept=async()=>{
    const token = user?.jwt;
    const { data } = await axios.post(
      "http://localhost:8000/api/v1/user/update-status",
      {userId:req.user?._id,status:"Accepted",reqId:req._id},
      {
        headers: {
          "authorization": `Bearer ${token}`,
        },
      }
    );
    if(data.success){
      alert(data.message);
    }else{
      alert("bawal");
    }
  }
  const handleReject=async()=>{
    const token = user?.jwt;
    const { data } = await axios.post(
      "http://localhost:8000/api/v1/user/update-status",
      {userId:req.user?._id,status:"Rejected",reqId:req._id},
      {
        headers: {
          "authorization": `Bearer ${token}`,
        },
      }
    );
    if(data.success){
      alert(data.message);
    }else{
      alert("bawal");
    }
  }
  return (
    <Box
      display={"flex"}
      width={"100%"}
      gap={"10px"}
      justifyContent={"space-between"}
      alignItems={"center"}
      border={"1px solid #d3d3d3"}
      borderRadius={"20px"}
      cursor={"pointer"}
      p={"5px 20px"}
      bg={"#f0f0f0"}
      transition={"transform .06s"}
      _hover={{
        transform: "scale(1.02)",
      }}
    >
      <Box
        display={"flex"}
        width={"30%"}
        justifyContent={"space-evenly"}
        alignItems={"center"}
      >
        <Avatar size="md" name={req.user?.name} src={req.user?.image} />
        <h2 style={{ fontSize: "20px" }}>{req.user?.name}</h2>
      </Box>
      <div className="reqButtons">
        <button className="acceptBtn" onClick={handleAccept}>Accept</button>
        <button className="rejectBtn" onClick={handleReject}>Reject</button>
        <Tooltip label="View Profile" placement="bottom">
          <button
            onClick={() => {
              const doctor = { ...req.user, ...req };
              navigate('/doctor-profile',{ state: { user: doctor } });
            }}
          >
            <i class="bi bi-eye"></i>
          </button>
        </Tooltip>
      </div>
    </Box>
  );
};

export default ReqCard;
