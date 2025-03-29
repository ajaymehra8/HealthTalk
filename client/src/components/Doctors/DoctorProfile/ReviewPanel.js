import { Input, InputGroup, Box, useToast } from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";
import ReviewCard from "../../Reviews/ReviewCard";
import { useAuthState } from "../../../context/AuthProvider";

const ReviewPanel = ({ doctor }) => {
  const navigate = useNavigate();
  const {user}=useAuthState();
  const toast=useToast();
  return (
    <Box
      background={"#f1f1f1"}
      width={"clamP(200px,77vw,520px)"}
      display={"flex"}
      alignItems={"start"}
      justifyContent={"center"}
      flexDir={"column"}
      borderRadius={"10px"}
    >
      <Box
        width={"clamp(200px,80vw,520px)"}
        mb={"20px"}
        p={"0 5px"}
        display={"flex"}
        flexDir={"column"}
        gap={"20px"}
        overflowY={"auto"}
        height={"200px"}
        paddingTop={"20px"}
      >
        {doctor?.reviews?.length>0?doctor?.reviews?.map((review) => (
          <ReviewCard review={review} />
        )):<h1 className="no-item-text">No Reviews</h1>}
      </Box>
      <InputGroup
        gap={"10px"}
        display={"flex"}
        alignItems={"center"}
        padding={"10px"}
        justifyContent={"space-between"}
      >
        <h4>Submit a review for Dr. {doctor?.name}.</h4>
        <button
          className="homePageBtn"
          style={{ marginTop: "0", borderRadius: "10px" }}
          onClick={() => {
            if(!user){
              return toast({
                title:"You are not logged in",
                status: "error",
                isClosable: true,
                duration: 5000,
                position: "top",
              })
            }
            navigate("/doctor/review", { state: { user: doctor } });
          }}
        >
          Review
        </button>
      </InputGroup>
    </Box>
  );
};

export default ReviewPanel;
