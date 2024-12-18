import React, { useState } from "react";
import {
  Card,
  CardBody,
  CardFooter,
  Image,
  Stack,
  Heading,
  Text,
  Button,
  Box,
  ButtonGroup,
} from "@chakra-ui/react";
import { HStack } from "@chakra-ui/react";

import { useNavigate } from "react-router-dom";

const DoctorCard = ({ doctor, handleFunction }) => {
  const navigate = useNavigate();
  const handleViewProfile = async () => {
    const doctorProf = await handleFunction(); // Assume this function fetches the doctor's profile data
    navigate("/doctor-profile", { state: { user: doctorProf } }); // Pass the profile data using `state`
  };
  return (
    <Card maxW="290px" cursor={"pointer"}>
      <CardBody>
        <Image
          src={doctor?.image}
          alt="Green double couch with wooden legs"
          borderRadius="lg"
        />
        <Stack mt="3" spacing=".2">
          <Heading size="md">Dr. {doctor?.name}</Heading>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "start",
              gap:"3%",
              width: "100%",
              padding: "10px 0",
            }}
          >
            <p>
              ₹ <b>{doctor?.clinicFee ? doctor?.clinicFee : "2,000"}</b> at clinic
            </p>
            <p>
              ₹ <b>{doctor?.onlineFee ? doctor?.onlineFee : "300"}</b> online
            </p>
          </div>
          <p style={{ fontSize: "17px", fontWeight: "500" }}>
            <i class="bi bi-geo-alt"></i>{" "}
            {doctor?.clinicLocation ? doctor?.clinicLocation : "Delhi, India"}
          </p>
        </Stack>
      </CardBody>
      <CardFooter mt={"-10px"}>
        <Box display={"flex"} justifyContent={"space-between"} width={"100%"}>
          <Button
            variant="solid"
            background={"#78be20"}
            color={"white"}
            w={"clamp(100px,20%,200px)"}
            onClick={handleViewProfile}
            letterSpacing={"1px"}
            _hover={{
              background: "green",
              color: "white",
            }}
          >
            View
          </Button>
          <HStack spacing={1}>
            {[1, 2, 3, 4, 5].map((index) => (
              <Box key={index} as="button">
                <i
                  class="bi bi-star-fill"
                  style={{
                    color: index <= doctor?.avgRating ? "#ffd700" : "#d1d1d3",
                  }}
                ></i>
              </Box>
            ))}
          </HStack>
        </Box>
        <p style={{ marginTop: "4px", fontSize: "20px", marginLeft: "5px" }}>
          ({doctor?.nRating})
        </p>
      </CardFooter>
    </Card>
  );
};

export default DoctorCard;
