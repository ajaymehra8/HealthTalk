import React, { useState } from "react";
import {
  Box,
  Avatar,
  Tooltip,
  Button,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import Navbar from "../Navbar";
import DoctorProf1 from "./DoctorProfile/DoctorProf1";
import Footer from "../Footer";
import ReviewPanel from "./DoctorProfile/ReviewPanel";
import ServicePanel from "./DoctorProfile/ServicePanel";

const DocProf = () => {
  const { state } = useLocation(); // Get the location object which contains the state
  const doctor = state?.user; // Access the user data from the state

  // Full text content
  const fullText =
    doctor?.description ||
    "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Illum vel illo rem error provident, veniam cum saepe eaque voluptates ut! Ex dolore officiis placeat inventore eum ab ipsum! Distinctio ipsa incidunt suscipit aliquid eligendi perferendis aperiam sunt esse illum, veritatis nisi, voluptatibus dolorem, magni sint.Our team includes experienced and caring professionals who share the belief that our care should be comprehensive and courteous - responding fully to your individual needs and preferences. We strive to provide exceptional service and a comfortable experience to all our patients. Each member of our team is dedicated to ensuring that you receive the highest level of care, tailored to your specific requirements.";

  // State to manage showing full text or truncated text
  const [isExpanded, setIsExpanded] = useState(false);

  // Function to handle toggling text display
  const toggleReadMoreLess = () => {
    setIsExpanded(!isExpanded);
  };

  // Split the full text into words and take the first 30 words
  const previewText = fullText.split(" ").slice(0, 30).join(" ");

  return (
    <>
      <Navbar />
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"start"}
        flexDir={"column"}
        bg={"white"}
        p={4}
        gap={4}
        w={"100vw"}
        minH={"100vh"}
        pt={"80px"}
        background={"#f1f1f1"}
      >
        <DoctorProf1 doctor={doctor} />
        <Box
      width={"clamp(340px,102%,1150px)"}
      display={"flex"}
          justifyContent={"space-between"}
          flexDirection={{ base: "column", md: "column", lg: "row" }}
          alignItems={"start"}
          padding={"10px 0"}
        >
          <Box
            w={{
              lg: "40%",
              base: "clamp(300px,100%,1150px)",
              md: "clamp(410px,100%,2000px)",
            }}
          >
            <Box>
              <h4 style={{ fontSize: "20px", fontWeight: "bold" }}>
                Personal Statement
              </h4>
              <Box
                padding={"10px 15px"}
                bg={"#ffffff"}
                border={"1px solid gray"}
                borderRadius={"10px"}
                mt={"10px"}
              >
                <p style={{ textAlign: "justify" }}>
                  {isExpanded ? fullText : previewText}
                  {/* Show "..." when text is truncated */}
                  {!isExpanded && "..."}
                </p>
                <Button
                  onClick={toggleReadMoreLess}
                  colorScheme="blue"
                  mt="10px"
                  variant="link"
                >
                  {isExpanded ? "Read Less" : "Read More"}
                </Button>
              </Box>
            </Box>

            <Box mt={"20px"}>
              <h4 style={{ fontSize: "20px", fontWeight: "bold" }}>
                Doctor Information
              </h4>
              <Box
                padding={"15px 15px 20px"}
                bg={"#ffffff"}
                border={"1px solid gray"}
                borderRadius={"10px"}
                mt={"10px"}
                display={"flex"}
                flexDir={"column"}
                gap={"10px"}
              >
                <ul>
                  <h1 style={{ fontSize: "17px", fontWeight: "500" }}>
                    Speciality
                  </h1>
                  <li style={{ fontSize: "12px", marginLeft: "25px" }}>
                    {doctor?.specialization}
                  </li>
                </ul>
                <ul>
                  <h1 style={{ fontSize: "17px", fontWeight: "500" }}>
                    Other treatment areas
                  </h1>
                  {doctor?.treatmentArea?.map((ta) => (
                    <li style={{ fontSize: "12px", marginLeft: "25px" }}>
                      {ta}
                    </li>
                  ))}
                </ul>
                <ul>
                  <h1 style={{ fontSize: "17px", fontWeight: "500" }}>
                    Education
                  </h1>
                  <li
                    style={{
                      fontSize: "12px",
                      marginLeft: "25px",
                      width: "80%",
                    }}
                  >
                    {doctor?.education}
                  </li>
                </ul>

                <ul>
                  <h1 style={{ fontSize: "17px", fontWeight: "500" }}>
                    Past Experience
                  </h1>
                  <li style={{ fontSize: "12px", marginLeft: "25px" }}>
                    {doctor?.pastExperience}
                  </li>
                </ul>
              </Box>
            </Box>
            <Box mt={"20px"}>
              <h4 style={{ fontSize: "20px", fontWeight: "bold" }}>
                Clinic Location
              </h4>
              <Box
                padding={"10px 15px"}
                bg={"#ffffff"}
                border={"1px solid gray"}
                borderRadius={"10px"}
                mt={"10px"}
              >
                <p>
                  {doctor?.clinicLocation
                    ? doctor?.clinicLocation?.name
                    : "No-157, Bhagya Lakshmi, Sir Balchandra Road, Raja Shivaji Vidyalaya, Landmark : Near Podar College of Commerce."}
                </p>
              </Box>
            </Box>
          </Box>

          {doctor?.role === "doctor" ? (
            <Box
              bg={"white"}
              w={{
                sm: "clamp(360px,100%,1000px)",
                md: "clamp(360px,100%,1000px)",
                lg: "50%",
              }}
              p={4}
              borderRadius={"lg"}
              borderWidth={"1px"}
              color="black"
              border={"1px solid gray"}
              mt={{ base: "50px", md: "50px", lg: "0" }}
            >
             <Tabs variant="line" width="100%">
  <TabList width="100%" display="flex" justifyContent="center">
    <Tab
      width="100%" // Make the tab full width
      _selected={{
        color: "#78be20",
        fontWeight: "500",
        borderColor: "#78be20",
      }}
      fontWeight="500"
    >
      Reviews
    </Tab>
  </TabList>

  <TabPanels width="100%">
    <TabPanel width="100%">
      <ReviewPanel doctor={doctor} />
    </TabPanel>
  </TabPanels>
</Tabs>

            </Box>
          ) : (
            <Box w="50%">
              <h1
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  marginBottom: "10px",
                }}
              >
                User Degree
              </h1>
              <iframe
                src={doctor?.degree}
                style={{
                  width: "100%",
                  height: "600px",
                }}
                title="PDF Viewer"
              />
            </Box>
          )}
        </Box>
      </Box>
      <Footer />
    </>
  );
};

export default DocProf;
