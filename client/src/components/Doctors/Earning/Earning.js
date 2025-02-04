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
            <h1 className="no-item-text">No Earning Yet.</h1>
 
    </Box>
  )
}

export default Earning
