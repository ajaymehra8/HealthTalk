import React from "react";
import { Box, Avatar, Tooltip, useToast } from "@chakra-ui/react";
import { useAuthState } from "../../../context/AuthProvider";
import axios from "axios";
const DoctorProf1 = ({ doctor }) => {
  const { user } = useAuthState();
  const toast = useToast();
  const bookAppoinment = async () => {
    const body = {
      doctor,
    };
    const token = user?.jwt;

    const headers = {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    };
    const { data } = await axios.post(
      `http://localhost:8000/api/v1/booking/create-booking`,
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
  };
  return (
    <Box
      w={"90%"}
      minH={"150px"}
      border={".5px solid gray"}
      borderRadius={"20px"}
      display={"flex"}
      alignItems={"center"}
      justifyContent={"start"}
      gap={"30px"}
      p={"10px 15px"}
      bg={"#ffffff"}
      position={"relative"}
    >
      <img
        src={doctor?.image}
        alt=""
        style={{ width: "18%", borderRadius: "20px" }}
      />
      <Box>
        <h1
          style={{
            fontSize: "25px",
            letterSpacing: "1px",
            fontWeight: "500",
          }}
        >
          Dr.{" "}
          {doctor?.name.charAt(0).toUpperCase() +
            doctor?.name.slice(1).toLowerCase()}
        </h1>
        <h3 style={{ color: "#78be20", fontWeight: "500" }}>
          Gynaecologist . 46 Years Exp.
        </h3>
        <h3
          style={{
            color: "gray",
            width: "400px",
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
            width: "210px",
            padding: "10px 0",
          }}
        >
          <p>
            ₹ <b>{doctor.clinicFee ? doctor.clinicFee : "2,000"}</b> at clinic
          </p>
          <p>
            ₹ <b>{doctor.onlineFee ? doctor.onlineFee : "300"}</b> online
          </p>
        
        </div>
        <button
            className="homePageBtn"
            style={{ marginTop: "0", borderRadius: "10px" }}
            onClick={bookAppoinment}
          >
            Book Appointment
          </button>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "50px",
            position: "absolute",
            top: "10px",
            right: "5px",
          }}
        >
          {user?.role === "user" && (
            <Tooltip label="Report" aria-label="A tooltip" placement="top">
              <button>
                <i class="bi bi-flag-fill"></i>
              </button>
            </Tooltip>
          )}
        </div>
      </Box>
    </Box>
  );
};

export default DoctorProf1;
