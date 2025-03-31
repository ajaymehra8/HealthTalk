import React, { useState } from "react";
import { Box, Button, useToast } from "@chakra-ui/react";
import moment from "moment";
import axios from "axios";
import { useAuthState } from "../../../context/AuthProvider";
import { useNavigate } from "react-router-dom";

const ReportCard = ({ report, setReports, reports }) => {
  const toast = useToast();
  const navigate = useNavigate();
  const createdAt = report?.createdAt;
  const timeAgo = createdAt ? moment(createdAt).fromNow() : "Unknown";
  const [loading, setLoading] = useState(false);
  const [deleteLoading,setDeleteLoading]=useState(false);
  const handleFunction = async () => {
    const { data } = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/v1/user/${report?.doctor?._id}`
    );
    return data.doctor;
  };
  const handleViewProfile = async () => {
    setLoading(true);
    const doctorProf = await handleFunction(); // Assume this function fetches the doctor's profile data
    setLoading(false);
    navigate("/doctor-profile", { state: { user: doctorProf } }); // Pass the profile data using `state`
  };
  const { user } = useAuthState();
  const handleDelete = async () => {
    const token = user?.jwt;
    if (!token) return;
    setDeleteLoading(true);
    const { data } = await axios.delete(
      `${process.env.REACT_APP_API_URL}/api/v1/report/${report._id}`,
      {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      }
    );
    if (data.success) {
      setReports((prevreport) =>
        prevreport.filter((r) => r._id !== report._id)
      );
      toast({
        title: data.message,
        status: "success",
        isClosable: true,
        duration: 5000,
        position: "top",
      });
    }
    setDeleteLoading(false);
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
        <img
          src={report?.doctor?.image}
          alt=""
          className="rectangle-img"
          style={{ height: "clamp(100px,20vh,300px)", width: "100%" }}
        />
        <h4 style={{ alignSelf: "center" }}>
          Dr. {report?.doctor?.name || "Unknown User"}
        </h4>
      </Box>
      <Box width={"70%"}>
        <h2 style={{ fontSize: "clamp(15px,4vw,20px)" }}>
          <b>Report:</b> {report?.report} by Mr. <b>{report?.user?.name}</b>.
        </h2>
        <h2 style={{ fontSize: "clamp(15px,4vw,20px)" }}>
          <b>Time:</b> {timeAgo ? timeAgo : "Unknown"}
        </h2>

        <div
          className="reqButtons"
          style={{
            width: "100%",
            gap: "15px",
            marginTop: "40px",
            justifyContent: "start",
          }}
        >
          <button
            className=" rounded-btn"
            style={{
              background: loading && "gray",
              borderColor: loading && "gray",
              backgroundColor: !loading ? "#78be20" : "gray",
              color: "white",
              letterSpacing:"1px"

            }}
            onClick={!loading ? handleViewProfile : undefined}
            disabled={loading}
            cursor={loading && "not-allowed"}
          >
            {!loading ? "View" : "Wait..."}
          </button>

          <button
            className="rejectBtn rounded-btn"
            onClick={!deleteLoading ? handleDelete : undefined}
            style={{
              background: deleteLoading && "gray",
              borderColor: deleteLoading && "gray",
            }}
            disabled={deleteLoading}
            cursor={deleteLoading && "not-allowed"}

          >
            {!deleteLoading ? "Delete" : "Wait..."}
          </button>
        </div>
      </Box>
    </Box>
  );
};

export default ReportCard;
