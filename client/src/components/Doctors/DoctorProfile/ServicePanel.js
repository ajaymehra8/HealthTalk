import React from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import {
  InputGroup,
  Box,
  useToast
} from "@chakra-ui/react";
import { useAuthState } from "../../../context/AuthProvider";

const ServicePanel = ({ doctor }) => {
  const navigate = useNavigate();
  const { user } = useAuthState();
const toast=useToast();
  const bookAppoinment = async () => {
   
    const body={
    doctor
    }
    const token = user?.jwt;

    const headers={
      "Content-Type":"application/json",
      "authorization": `Bearer ${token}`,
    }
    const {data}=await axios.post(`http://localhost:8000/api/v1/booking/create-booking`,body,{headers});
if(data.success){
  toast({
    title: data.message,
    status: "success",
    isClosable: true,
    duration: 5000,
    position: "top",
  });
}
    
  };

  return (
    <Box
      background={"#f1f1f1"}
      width={"100%"}
      display={"flex"}
      alignItems={"start"}
      justifyContent={"center"}
      flexDir={"column"}
      p={"5px 10px"}
      borderRadius={"10px"}
    >
      <Box width={"100%"} mb={"20px"}>
        aja
      </Box>
      <InputGroup
        gap={"20px"}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <h4>Book appointment with Dr. {doctor?.name}.</h4>
        <button
          className="homePageBtn"
          style={{ marginTop: "0", borderRadius: "10px" }}
          onClick={bookAppoinment}
        >
          Book Appointment
        </button>
       
      </InputGroup>
    </Box>
  );
};

export default ServicePanel;

