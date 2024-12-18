import React from "react";
import { Box, Progress, Stack, Text, Flex } from "@chakra-ui/react";

const Testimonial = () => {
  return (
    <Box
      w={"100%"}
      display={"flex"}
      alignItems={"center"}
      justifyContent={"space-evenly"}
      p={"10px 0"}
      className="testimonials"
      sx={{
        '@media (max-width: 900px)': {
          flexDirection: 'column-reverse',
          gap:"50px"
        },
      }}
    >
      <Box width={"42%"} sx={{
        '@media (max-width: 900px)': {
          width: "clamp(400px,90vw,900px)!important"

        },
      }}>
        <h1 style={{ fontSize: "25px", fontWeight: "700", lineHeight: "1" }}>
          Finest Client Care & Amenities Service
        </h1>
        <p
          style={{
            fontSize: "15px",
            marginTop: "10px",
            lineHeight: "1.3",
            letterSpacing: "1px",
            textAlign: "justify",
          }}
        >
          At the heart of our Camp Management System is a commitment to
          providing the finest client care and amenities service. This feature
          ensures that all participants of the medical camps receive top-notch
          care and have access to a range of amenities designed to enhance their
          experience.
        </p>
        <Stack spacing={"2px"} mt={"8px"}>
          <Box mb="4">
            <Text fontWeight="bold" textAlign="left">
              Return Clients
            </Text>
            <Flex alignItems="center">
              <Progress
                value={80}
                size="sm"
                sx={{
                    '& > div': {
                      backgroundColor: '#78be20', // Custom hex color for the filled portion
                    },
                    backgroundColor: '#edf2f7', // Custom hex color for the track
                  }}                  borderRadius="lg"
                width="100%"
              />
              <Text ml="4" fontWeight="bold">
                {80}%
              </Text>
            </Flex>
          </Box>

          <Box mb="4">
            <Text fontWeight="bold" textAlign="left">
              Clients Satisfaction
            </Text>
            <Flex alignItems="center">
              <Progress
                value={95}
                size="sm"
                sx={{
                    '& > div': {
                      backgroundColor: '#78be20', // Custom hex color for the filled portion
                    },
                    backgroundColor: '#edf2f7', // Custom hex color for the track
                  }}                  borderRadius="lg"
                width="100%"
              />
              <Text ml="4" fontWeight="bold">
                {95}%
              </Text>
            </Flex>
          </Box>

          <Box mb="4">
            <Text fontWeight="bold" textAlign="left">
              Clients Refferal
            </Text>
            <Flex alignItems="center">
              <Progress
                value={70}
                size="sm"
                sx={{
                    '& > div': {
                      backgroundColor: '#78be20', // Custom hex color for the filled portion
                    },
                    backgroundColor: '#edf2f7', // Custom hex color for the track
                  }}                borderRadius="lg"
                width="100%"
              />
              <Text ml="4" fontWeight="bold">
                {70}%
              </Text>
            </Flex>
          </Box>
        </Stack>
      </Box>
      <img
        style={{ width: "42%",borderRadius:'10px' }}
        src="https://st4.depositphotos.com/8846918/40660/i/450/depositphotos_406604956-stock-photo-blood-pressure-meter-medical-equipment.jpg"
        alt=""
        className="testimonialImg"
      />
    </Box>
  );
};

export default Testimonial;
