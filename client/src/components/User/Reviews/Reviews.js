import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { useAuthState } from "../../../context/AuthProvider";
import { Box } from "@chakra-ui/react";
import ReviewCard from "./ReviewCard";

const Reviews = () => {
  const { user } = useAuthState();
  const [reviews, setReviews] = useState([]);
  let token = user?.jwt;

  const fetchReviews =useCallback( async () => {
    if(!token) return;
    const { data } = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/v1/review`,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: `Bearer ${token}`,
        },
      }
    );
    if (data.success) {
      setReviews(data?.reviews);
      console.log(data.reviews);
    }
  },[reviews,token]);
  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);
  return (
    <Box
      display={"flex"}
      flexDir={"column"}
      alignItems={"start"}
      justifyContent={"start"}
      w={"clamp(400px,80%,1000px)"}
      minH={"85vh"}
      maxH={"85vh"}
      p={"20px"}
      pt={"15px"}
      bg={"white"}
      borderRadius={"10px"}
      pb={"30px"}
      boxShadow={"1px 1px 10px 4px #686d77"}
      overflowY={"auto"}
      gap={"20px"}
      sx={{
        "@media(max-width:500px)":{
          maxHeight:"63vh",
          minHeight:"63vh"
        }
      }}
    >
      {reviews.length > 0 &&<h1 className="page-head" style={{marginBottom:"5px"}}>Your Reviews</h1>}
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <ReviewCard
            review={review}
            setReviews={setReviews}
            reviews={reviews}
          />
        ))
      ) : (
        <h1 className="no-item-text">No reviews</h1>
      )}
    </Box>
  );
};

export default Reviews;
