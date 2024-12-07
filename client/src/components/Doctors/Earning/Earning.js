import React, { useState, useEffect, useCallback } from "react";
import { useAuthState } from "../../../context/AuthProvider";
import axios from "axios";
import { Box } from "@chakra-ui/react";

const Earning = () => {
    const [earning,setEarning]=useState([]);
  return (
<Box
      display={"flex"}
      flexDir={"column"}
      alignItems={"center"}
      justifyContent={"start"}
      w={"70%"}
      minH={"80vh"}
      maxH={"80vh"}
      p={"20px"}
      pt={"10px"}
      bg={"white"}
      borderRadius={"10px"}
      pb={"30px"}
      boxShadow={"1px 1px 10px 4px #686d77"}
      overflowY={"auto"}
    >     
            <h1 className="no-item-text">No Earning Yet.</h1>
 
    </Box>
  )
}

export default Earning
