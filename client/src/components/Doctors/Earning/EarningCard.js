import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Avatar, Tooltip, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useAuthState } from "../../../context/AuthProvider";

const EarningCard = ({appoinment}) => {
    const {user}=useAuthState();
  return (
    <Box
      display={"flex"}
      width={"100%"}
      gap={"20px"}
      justifyContent={"space-between"}
      alignItems={"center"}
      border={"1px solid #d3d3d3"}
      borderRadius={"20px"}
      cursor={"pointer"}
      p={"5px 20px"}
      bg={"#f0f0f0"}
      
    >
      <Box
        display={"flex"}
        width={"40%"}
        gap={"10px"}
        justifyContent={"space-evenly"}
        alignItems={"center"}
      >
        <Avatar size="md" name={appoinment?.user?.name} src={appoinment?.user?.image} />
        <Box width={"100%"}>
        <h2 style={{ fontSize: "15px" }}>Mr. {appoinment?.user?.name}</h2>
        <h2 style={{ fontSize: "15px" }}><b>Email:</b> {appoinment?.user?.email}</h2>
        
        </Box>
      </Box>

      <div className="reqButtons" style={{gap:"35px",justifyContent:"center",width:"30%"}}>
        <button className="acceptBtn">
          + ${user?.clinicFee}
        </button>
        <button className="rejectBtn">
          Refund
        </button>
      </div>
    </Box>
  );
};

export default EarningCard;
