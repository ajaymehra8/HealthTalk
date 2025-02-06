import React, { useState } from "react";
import { Box, position } from "@chakra-ui/react";
import { useAuthState } from "../../context/AuthProvider";
import Navbar from "../Navbar";
import UserInfoCard from "./UserInfoCard";
import ProfSideBar from "../ProfSideBar";
import { Routes, Route, Navigate } from "react-router-dom";
import Approvals from "../Admin/Approvals";
import DoctorInfo from "../Doctors/DoctorInfo";
import UserAppoinments from "./UserAppoinments";
import Appoinments from "../Doctors/Appoinments/Appoinments";
import Reviews from "./Reviews/Reviews";
import DoctorReviews from "../Doctors/Reviews/DoctorReviews";
import Earning from "../Doctors/Earning/Earning";
import WebInfo from "../Admin/adminPageComponent/WebInfo";

const UserInfo = () => {
  const { user } = useAuthState();

  const [imageSrc, setImageSrc] = useState(user?.image);
  const [imageFile, setImageFile] = useState(null);
  return (
    <>
      <Navbar />

      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
        w={"100vw"}
      >
        <ProfSideBar
          imageSrc={imageSrc}
          setImageSrc={setImageSrc}
          imageFile={imageFile}
          setImageFile={setImageFile}
        />
        <Box
          w={{lg:"80%",sm:"100%"}}
          ml={{lg:'250px'}}
          background={"linear-gradient(to right,#6b707a, #393f4d)"}
          boxSizing={"border-box"}
          minH={'100vh'}
          height={"auto"}
          display={"flex"}
          pt={'70px'}
          pb={'17px'}
          flexDir={"column"}
          alignItems={"center"}
          justifyContent={"center"}
          overflow={"hidden"}
          sx={{
            "@media (max-width: 950px)": {
              width: "100%",
              marginLeft:0,
            },
          }}
        >
          <Routes>
            <Route
              path="my-info"
              element={
                user?.role === "doctor" ? (
                  <DoctorInfo image={imageFile} />
                ) : user?.role === "user" ? (
                  <UserInfoCard image={imageFile} />
                ) : (
                  <WebInfo />
                )
              }
            />
            <Route path="approvals" element={<Approvals />} />
            <Route path="your-appoinment" element={<UserAppoinments />} />
            <Route path="appoinments" element={<Appoinments />} />
            <Route
              path="your-reviews"
              element={
                !(user?.role === "doctor") ? <Reviews /> : <DoctorReviews />
              }
            />
            <Route path="earning" element={<Earning />} />
            <Route path="/" element={<Navigate to="my-info" replace />} />{" "}
            {/* Default option */}
          </Routes>
        </Box>
      </Box>
    </>
  );
};

export default UserInfo;
