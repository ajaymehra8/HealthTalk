import { Box, Select, SimpleGrid } from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import DoctorCard from "../components/Doctors/DoctorCard";

const Doctors = ({ id, doctors,setDoctors }) => {
  const [showMap,setShowMap]=useState(false);
  const [loadingText,setLoadingText]=useState("Loading Doctors...")
  const getSingleDoctor = async (id) => {
    const { data } = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/v1/user/${id}`
    );
    return data.doctor;
  };

  const fetchDoctors=async(queryName)=>{
    setShowMap(false);
    try {
      if(queryName){
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/user/?filter=${queryName}`
      );
      console.log(data);
      setDoctors(data.doctors);
    }else{
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/v1/user`
        );  
        console.log(data);
        setDoctors(data.doctors);
      }
   
    } catch (error) {
      console.error("Failed to fetch doctors:", error);
    }
  }

  const fetchDoctorsNearUser = async () => {
    try {
      if (!navigator.geolocation) {
        console.error("Geolocation is not supported by this browser.");
        return;
      }
  
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
  
          const { data } = await axios.get(
            `${process.env.REACT_APP_API_URL}/api/v1/user`,
            {
              params: {
                lat: latitude,
                lng: longitude,
                filter: "location",
              },
            }
          );
  setShowMap(true);
  if(data.doctors.length===0){
    setLoadingText("No clinic available near you.");

  }
          console.log(data);
          setDoctors(data.doctors);

        },
        (error) => {
          console.error("Failed to get location:", error);
        }
      );
    } catch (error) {
      console.error("Failed to fetch doctors:", error);
    }
  };
  
const setFilter=(e)=>{
  console.log(e.target.value);
  if(e.target.value==="rating"){
fetchDoctors("rating");
  }else if(e.target.value==="price"){
    fetchDoctors("price");

  }else if(e.target.value==="near-me"){
fetchDoctorsNearUser();
  }else{
    fetchDoctors();
  }
}
  return (
    <Box
      p={"50px 10px"}
      display={"flex"}
      alignItems={"center"}
      justifyContent={"center"}
      minH={"80vh"}
      flexDir={"column"}
      width={{ sm: "100%", md: "80%" }}
      id={id}
    >
      
        <>
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
          <Select
            placeholder="All"
            width="200px"
            alignSelf={"flex-start"}
            _focus={{ border: "none", outline: "none", borderColor: "white" }}
            onChange={setFilter} // Call function on change

          >
            <option value="rating">Rating</option>
            <option value="near-me">Clinic near you</option>
            <option value="price">Price</option>
          </Select>
          {doctors.length>0 ? (
          <SimpleGrid
            columns={{ base: 1, md: 3, lg: 3 }}
            spacing="40px"
            p={"20px 0"}
          >
            {doctors.map((d) => (
              <DoctorCard
                key={d._id}
                doctor={d}
                handleFunction={() => getSingleDoctor(d._id)}
              />
            ))}
          </SimpleGrid>)
          : (
            <h1 className="no-item-text" style={{alignSelf:"center"}}>{loadingText}</h1> // Loading fallback
          )}
        </>
      
    </Box>
  );
};

export default Doctors;
