import React, { useState } from "react";
import { Box, Tooltip, useToast, useDisclosure } from "@chakra-ui/react";
import { useAuthState } from "../../../context/AuthProvider";
import axios from "axios";
import ReportModal from "../../Report/ReportModal";
const DoctorProf1 = ({ doctor }) => {
  const { user } = useAuthState();
  const toast = useToast();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const bookAppoinment = async () => {
    if (!user) {
      return toast({
        title: "You are not logged in",
        status: "error",
        isClosable: true,
        duration: 5000,
        position: "top",
      });
    }
    const body = {
      doctor,
    };
    const token = user?.jwt;
    setLoading(true);
    const headers = {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    };

    const { data } = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/v1/booking/create-booking`,
      body,
      { headers }
    );
    if (data.success) {
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
      width={"clamp(342px,102%,1150px)"}
      minH={"150px"}
      overflow={"hidden"}
      height={"auto"}
      border={".5px solid gray"}
      borderRadius={"20px"}
      display={"flex"}
      alignItems={"center"}
      justifyContent={"start"}
      gap={{ sm: "20px", md: "30px" }}
      p={"10px 15px"}
      bg={"#ffffff"}
      position={"relative"}
    >
      <img
        src={doctor?.image}
        alt=""
        style={{
          width: "clamp(140px,18%,500px)",
          borderRadius: "20px",
          height: "clamp(150px,80vh,190px)",
          marginRight: "10px",
        }}
      />
      <Box>
        <h1
          style={{
            fontSize: "clamp(16px,5vw,25px)",
            letterSpacing: "1px",
            fontWeight: "500",
          }}
        >
          Dr.{" "}
          {doctor?.name.charAt(0).toUpperCase() +
            doctor?.name.slice(1).toLowerCase()}
        </h1>
        <h3 style={{ color: "#78be20", fontWeight: "500" }}>
          {doctor?.specialization} . {doctor?.experience} Years Exp.
        </h3>
        <h3
          style={{
            color: "gray",
            fontSize: "16px",
            letterSpacing: "1px",
          }}
        >
          {doctor?.education ||
            "MBBS, MD - Obstetrics & Gynaecology, FICS, FICOG Mumbai"}
        </h3>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            width: "clamp(150px,80%,210px)",
            padding: "10px 0",
          }}
        >
          <p>
            ₹ <b>{doctor?.clinicFee ? doctor?.clinicFee : "2,000"}</b> at clinic
          </p>
        
        </div>
        {!(user?.role === "admin") && (
          <button
            className="homePageBtn"
            style={{
              marginTop: "0",
              borderRadius: "10px",
              background: loading && "gray",
              cursor: loading && "not-allowed",
            }}
            onClick={!loading ? bookAppoinment : undefined}
          >
            {!loading ? "Book Appointment" : "Wait..."}
          </button>
        )}
        <Box
          paddingRight={{ md: "2vw" }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "50px",
            position: "absolute",
            top: "10px",
            right: "-11px",
          }}
        >
          {!(user?.role === "admin") && (
            <Tooltip label="Report" aria-label="A tooltip" placement="top">
              <button
                onClick={onOpen}
                style={{ fontSize: "clamp(16px,5vw,25px)" }}
              >
                <i class="bi bi-flag-fill"></i>
              </button>
            </Tooltip>
          )}
          <ReportModal
            isOpen={isOpen}
            onClose={onClose}
            onOpen={onOpen}
            doctorId={doctor?._id}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default DoctorProf1;
