import React, { useState } from "react";
import { Box, useToast } from "@chakra-ui/react";
import moment from "moment";
import axios from "axios";
import { useAuthState } from "../../../context/AuthProvider";

const ReviewCard = ({ review, setReviews, reviews }) => {
  const toast = useToast();
  const createdAt = review?.createdAt;
  const timeAgo = createdAt ? moment(createdAt).fromNow() : "Unknown";
  const [loading, setLoading] = useState(false);

  const { user } = useAuthState();
  const handleDelete = async () => {
    const token = user?.jwt;
    if (!token) return;
    setLoading(true);
    const { data } = await axios.delete(
      `${process.env.REACT_APP_API_URL}/api/v1/review/${review._id}`,
      {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      }
    );
    if (data.success) {
      setReviews((prevReview) =>
        prevReview.filter((r) => r._id !== review._id)
      );
      toast({
        title: data.message,
        status: "success",
        isClosable: true,
        duration: 5000,
        position: "top",
      });
    }
    setLoading(false);
  };
  return (
    <Box
      display={"flex"}
      width={"100%"}
      gap={"8%"}
      justifyContent={"start"}
      alignItems={"start"}
      border={"1px solid #d3d3d3"}
      borderRadius={"20px"}
      cursor={"pointer"}
      p={"5px 20px"}
      bg={"#f0f0f0"}
    >
      <Box
        display={"flex"}
        flexDir={"column"}
        justifyContent={"center"}
        width={"clamp(190px,25%,1000px)"}
        alignItems={"center"}
      >
        <img src={review?.doctor?.image} alt="" className="rectangle-img" style={{width:"100%",height:"clamp(100px,25vh,340px)"}}/>
        <h4 style={{ alignSelf: "center" }}>
          Mr. {review?.doctor?.name || "Unknown User"}
        </h4>
      </Box>
      <Box width={"70%"}>
        <h2 style={{ fontSize: "clamp(15px,4vw,20px)" }}>
          <b>Review:</b> {review?.text}
        </h2>
        <h2 style={{ fontSize: "clamp(15px,4vw,20px)" }}>
          <b>Time:</b> {timeAgo ? timeAgo : "Unknown"}
        </h2>

        <button
          className="rejectBtn rounded-btn"
          onClick={!loading?handleDelete:undefined}
          style={{
            marginTop: "40px",
            background: loading && "gray",
            borderColor: loading && "gray",
          }}
          disabled={loading}
        >
          {!loading ? "Delete" : "Wait..."}
        </button>
      </Box>
    </Box>
  );
};

export default ReviewCard;
