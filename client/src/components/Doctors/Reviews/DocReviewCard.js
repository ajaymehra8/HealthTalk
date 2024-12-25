import React,{useState} from "react";
import { Box, Tooltip, Avatar, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import axios from "axios";
import { useAuthState } from "../../../context/AuthProvider";

const DocReviewCard = ({ review, setReviews, reviews }) => {
  const navigate = useNavigate();
  const toast = useToast();
  const [loading,setLoading]=useState(false);
  const createdAt = review?.createdAt;
  const timeAgo = createdAt ? moment(createdAt).fromNow() : "Unknown";
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
        width={"25%"}
        alignItems={"center"}
      >
        <img src={review?.user?.image} alt="" className="rectangle-img" />
        <h4 style={{ alignSelf: "center" }}>
          Mr. {review?.user?.name || "Unknown User"}
        </h4>
      </Box>
      <Box>
        <h2 style={{ fontSize: "20px" }}>
          <b>Review:</b> {review?.text}
        </h2>
        <h2 style={{ fontSize: "20px" }}>
          <b>Time:</b> {timeAgo ? timeAgo : "Unknown"}
        </h2>

          <button className="rejectBtn rounded-btn" onClick={handleDelete} style={{marginTop:"40px",background:loading&&"gray"}}>
          {!loading?"Delete":"Wait..."}
          </button>
      </Box>
    </Box>
  );
};

export default DocReviewCard;
