import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Avatar, Tooltip, useToast } from "@chakra-ui/react";
import { useAuthState } from "../../context/AuthProvider";
import axios from "axios";

const ReqCard = ({ req, setReqs }) => {
  const { user } = useAuthState();
  const [acceptLoading, setAcceptLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const handleAccept = async () => {
    const token = user?.jwt;
    if (!token) {
      return;
    }
    setAcceptLoading(true);
    const { data } = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/v1/user/update-status`,
      { userId: req.user?._id, status: "Accepted", reqId: req._id },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    if (data.success) {
      toast({
        title: data.message,
        status: "success",
        isClosable: true,
        duration: 5000,
      });
    } else {
      alert("bawal");
    }
    setAcceptLoading(false);
  };
  const handleReject = async () => {
    const token = user?.jwt;
    setRejectLoading(true);
    const { data } = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/v1/user/update-status`,
      { userId: req.user?._id, status: "Rejected", reqId: req._id },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    if (data.success) {
      setReqs((prevReqs) =>
        prevReqs.filter((r) => r?.user?._id !== req?.user?._id)
      );
      toast({
        title: data.message,
        status: "success",
        isClosable: true,
        duration: 5000,
        position: "top",
      });
    } else {
      alert("bawal");
    }
    setRejectLoading(false);
  };
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
        <button className="acceptBtn" onClick={!acceptLoading?handleAccept:undefined}>
          {!acceptLoading ? "Accept" : "Accepting"}
        </button>
        <button className="rejectBtn" onClick={!rejectLoading?handleReject:undefined}>
          {!rejectLoading ? "Reject" : "Rejecting"}
        </button>
        <Tooltip label="View Profile" placement="bottom">
          <button
            onClick={() => {
              const doctor = { ...req.user, ...req };
              navigate("/doctor-profile", { state: { user: doctor } });
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
