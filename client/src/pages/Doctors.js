import { Box, SimpleGrid } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import DoctorCard from "../components/Doctors/DoctorCard";

const Doctors = ({id}) => {
  const [doctors, setDoctors] = useState(null);
  const getDoctor = async () => {
    const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/user`);
    setDoctors(data.doctors);
  };
  const getSingleDoctor = async (id) => {
    const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/user/${id}`);
    return data.doctor;
  };
  useEffect(() => {
    getDoctor();
  }, []);
  return (
    <Box
      p={"50px 10px"}
      display={"flex"}
      alignItems={"center"}
      justifyContent={"center"}
      flexDir={"column"}
      id={id}
    >
      <p
        style={{
          padding: "2px 10px",
          background: "rgba(121, 188, 67, 0.4)",
          color: "#79bc43",
          fontWeight: "500",
          cursor: "pointer",
        }}
      >
        Lets connect
      </p>
      <h5
        style={{
          fontSize: "30px",
          letterSpacing: "1px",
          fontWeight: "700",
          marginTop: "10px",
          color: "#3a404e",
        }}
      >
        With Popular Doctors
      </h5>
      <SimpleGrid
        columns={{ sm: 2, md: 3, lg: 4 }} // Defines the number of columns for different screen sizes
        spacing="40px" // Space between the cards
        p={"20px 0"}
      >
        {doctors &&
          doctors.map((d) => (
            <DoctorCard
              key={d._id}
              doctor={d}
              handleFunction={() => getSingleDoctor(d._id)}
            />
          ))}
      </SimpleGrid>
    </Box>
  );
};

export default Doctors;
