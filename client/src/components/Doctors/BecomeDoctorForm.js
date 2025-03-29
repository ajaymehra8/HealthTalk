import { Box, Input, Button, Text, useToast, Flex } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import Navbar from "../Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "../../context/AuthProvider";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const BecomeDoctorForm = () => {
  const { user, setUser } = useAuthState();

  // State for input values
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [education, setEducation] = useState("");
  const [pastExperience, setPastExperience] = useState("");
  const [description, setDescription] = useState("");
  const [clinicLocation, setClinicLocation] = useState("");
  const [clinicCoordinates,setClinicCoordinates]=useState({});

  const [treatmentArea, settreatmentArea] = useState([]);
  const [currentArea, setCurrentArea] = useState("");
  const [clinicFee, setClinicFee] = useState(0);
  const [specialization, setSpecialization] = useState("");
  const [experienceYear, setExperienceYear] = useState(0);

  const [onlineFee, setOnlineFee] = useState("");
  const [pdfFile, setPdfFile] = useState(null); // For the PDF file
  const [fileName, setFileName] = useState("No file chosen");

  const marker = useRef(null);
  const map = useRef(null);

  const navigate = useNavigate();

  const mapContainer = useRef(null); // Use a ref to access the div

  useEffect(() => {
    if (!mapContainer.current) return; // Ensure the container exists

    map.current = new maplibregl.Map({
      container: mapContainer.current, // Use ref instead of ID
      style: "https://maps.geoapify.com/v1/styles/osm-carto/style.json?apiKey=17bcdbc86fda4dfca3ad3328a4ebb4d8", // Style URL
      center: [77.1025, 28.7041], // New Delhi, India [lng, lat]
      zoom: 0,
    });
    map.current.on("load", () => {
      map.current.flyTo({
        center: [77.1025, 28.7041], // Target location
        zoom: 4, // Zoom-in level
        speed: 0.8, // Animation speed (lower is slower)
        curve: 1.5, // Smoothness of the transition
        essential: true, // Ensures animation works smoothly
      });
    });
    return () => map.current.remove(); // Cleanup on unmount
  }, []);

  useEffect(() => {
    setName(user?.name || "");
    setEmail(user?.email || "");
  }, [user]);
  const toast = useToast();
  const handleKeydown = (event) => {
    if (event.key === "Enter" && currentArea.trim() !== "") {
      if (treatmentArea.length > 5) {
        toast({
          title: "You can add only 5 treatment area",
          status: "warning",
          position: "top",
          isClosable: true,
          duration: 5000,
        });
        return;
      }
      settreatmentArea((prevtreatmentArea) => [
        ...prevtreatmentArea,
        currentArea,
      ]);
      setCurrentArea("");
    }
  };
  const handleChange = (event) => {
    let value = parseInt(event.target.value, 10);
    // Ensure the value stays within the range
    if (value < 1) {
      value = 1;
    } else if (value > 30) {
      value = 30;
    }
    setClinicFee(value);
  };

  const handleOnlineFeeChange = (event) => {
    let value = parseInt(event.target.value, 10);
    // Ensure the value stays within the range
    if (value < 1) {
      value = 1;
    } else if (value > 10) {
      value = 10;
    }
    setOnlineFee(value);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPdfFile(file); // Store the selected PDF file
      setFileName(file.name);
    } else {
      setFileName("No file chosen");
    }
  };

  const handleSubmit = async () => {
    // You can send the form data, including the PDF file, to the backend here
    if (
      !name ||
      !email ||
      !education ||
      !pastExperience ||
      !description ||
      !clinicLocation ||
      !treatmentArea.length ||
      !clinicFee ||
      !specialization ||
      !experienceYear ||
      !onlineFee ||
      !pdfFile
    ) {
      toast({
        title: "Required fields missing",
        description: "Please fill out all required fields.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    const formData = new FormData();
    console.log(treatmentArea);
    formData.append("name", name);
    formData.append("email", email);
    formData.append("education", education);
    formData.append("experience", experienceYear);
    formData.append("pastExperience", pastExperience);

    formData.append("description", description);
    const locationForDb = {
      name: clinicLocation, // Subcity, City format
      coordinates: {
        type: "Point",
        coordinates: [clinicCoordinates?.lng, clinicCoordinates?.lat], // [longitude, latitude]
      },
    };

    formData.append("clinicLocation", JSON.stringify(locationForDb));
    formData.append("specialization", specialization);

    formData.append("treatmentArea", JSON.stringify(treatmentArea));
    formData.append("clinicFee", clinicFee);
    formData.append("onlineFee", onlineFee);
    formData.append("degree", pdfFile); // Attach the PDF file
    try {
      const token = user?.jwt;
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/v1/user/requestToBecomeDoctor`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
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
          position: "top",
        });
        const updatedUser = { ...data.user, jwt: token };
        setUser(updatedUser); // Update state
        localStorage.setItem("userInfo", JSON.stringify(updatedUser)); // Sync local storage
        navigate("/my-profile/my-info");
      } else {
        toast({
          title: data.message,
          description: data.subMessage || "Please try again later.",
          status: "warning",
          isClosable: true,
          duration: 5000,
          position: "top",
        });
      }
    } catch (err) {
      toast({
        title: err.response.data.message,
        description: "Please try again later.",
        status: "error",
        isClosable: true,
        duration: 5000,
        position: "top",
      });
    }
  };

  //  get location function
  const getLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
  
          // Store coordinates separately
          setClinicCoordinates({ lat: latitude, lng: longitude });
  
          // Reverse Geocoding to get location name
          const apiKey = "17bcdbc86fda4dfca3ad3328a4ebb4d8";
          const geocodeUrl = `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=${apiKey}`;
  
          try {
            const response = await fetch(geocodeUrl);
            const data = await response.json();
            
            if (data.features.length > 0) {
              const properties = data.features[0].properties;
              console.log(properties);
              const colony = properties.name||properties.hamlet||properties.address_line1 || properties.neighbourhood || "Unknown Colony";
              const city = properties.city || "Unknown City";
              setClinicLocation(`${colony}, ${city}`); // Store formatted location
            } else {
              setClinicLocation("Unknown location");
            }
          } catch (error) {
            console.error("Geocoding error:", error);
            setClinicLocation("Location not found");
          }
  
          // Remove old marker if it exists
          if (marker.current) marker.current.remove();
  
          // Add new marker
          marker.current = new maplibregl.Marker()
            .setLngLat([longitude, latitude])
            .addTo(map.current);
  
          // Move map to user's location
          map.current.flyTo({
            center: [longitude, latitude],
            zoom: 14,
            speed: 1,
          });
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            toast({
              title: "Location Permission Denied",
              position: "top",
              description: "Please enable location services in your browser settings.",
              status: "error",
              duration: 5000,
              isClosable: true,
            });
          } else {
            alert("Unable to fetch location. Try again later.");
          }
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };
  
  //  clickable location
  const updateLocation = async (latitude, longitude) => {
    setClinicCoordinates({ lat: latitude, lng: longitude });
  
    // Reverse Geocoding to get Subcity, City
    const apiKey = "17bcdbc86fda4dfca3ad3328a4ebb4d8";
    const geocodeUrl = `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=${apiKey}`;
  
    try {
      const response = await fetch(geocodeUrl);
      const data = await response.json();
  
      if (data.features.length > 0) {
        const properties = data.features[0].properties;
        console.log(properties);
        const subcity =properties.name||properties.hamlet||properties.address_line1 || properties.neighbourhood || "Unknown Colony";;
        const city = properties.city || "Unknown City";
        setClinicLocation(`${subcity}, ${city}`);
      } else {
        setClinicLocation("Unknown Location");
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      setClinicLocation("Location not found");
    }
  
    // Remove old marker if it exists
    if (marker.current) marker.current.remove();
  
    // Add new marker at the clicked location
    marker.current = new maplibregl.Marker()
      .setLngLat([longitude, latitude])
      .addTo(map.current);
  
    // Move map to the new location
    map.current.flyTo({
      center: [longitude, latitude],
      zoom: 14,
      speed: 1,
    });
  };
  
  // Add click event on the map
  useEffect(() => {
    if (map.current) {
      map.current.on("click", (e) => {
        const { lng, lat } = e.lngLat;
        updateLocation(lat, lng);
      });
    }
  }, []);

  return (
    <>
      <Navbar />
      <Box
        minH={"100vh"}
        w={"100vw"}
        pt={"55px"}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
        bg={"linear-gradient(to right, #393f4d, #6b707a)"}
      >
        <Box
          w={"clamp(300px,70vw,1000px)"}
          h={"80vh"}
          display={"flex"}
          flexDirection={"column"}
          alignItems={"start"}
          justifyContent={"start"}
          p={"20px"}
          borderRadius={"15px"}
          gap={"25px"}
          background={"white"}
          overflowY={"scroll"}
          boxShadow={"1px 1px 10px gray"}
          css={{
            scrollBehavior: "smooth",
            "&::-webkit-scrollbar": {
              width: "0",
            },
          }}
        >
          <h1 style={{ fontSize: "27px", fontWeight: "500", color: "black" }}>
            Enter Your Info
          </h1>
          <Input
            type="text"
            placeholder="Enter your name"
            bg={"white"}
            p={"5px"}
            fontSize={"18px"}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            type="email"
            placeholder="Enter your email"
            bg={"white"}
            p={"5px"}
            fontSize={"18px"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Enter your education"
            bg={"white"}
            p={"5px"}
            fontSize={"18px"}
            value={education}
            onChange={(e) => setEducation(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Enter your experience"
            bg={"white"}
            p={"5px"}
            fontSize={"18px"}
            value={pastExperience}
            onChange={(e) => setPastExperience(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Enter your specialization"
            bg={"white"}
            p={"5px"}
            fontSize={"18px"}
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Enter your description"
            bg={"white"}
            p={"5px"}
            fontSize={"18px"}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Flex gap={2} mb={3} width={"100%"}>
            <Input
              type="text"
              placeholder="Choose your location from map"
              bg="white"
              p="5px"
              readOnly
              fontSize="18px"
              value={clinicLocation}
              onChange={(e) => setClinicLocation(e.target.value)}
            />
            <Button colorScheme="blue" onClick={getLocation} minW={"110px"}>
              Your Location
            </Button>
          </Flex>
          <div
            ref={mapContainer}
            style={{ height: "80vh", width: "100%", minHeight: "300px" }}
          ></div>

          <Box width={"100%"}>
            <Input
              type="text"
              placeholder="Enter your other treatment areas (Press enter after writing one area)"
              bg={"white"}
              p={"5px"}
              fontSize={"18px"}
              value={currentArea}
              onChange={(e) => setCurrentArea(e.target.value)}
              onKeyDown={handleKeydown}
              width={"100%"}
            />
            <Box
              display={"flex"}
              gap={"10px"}
              width={"100%"}
              flexWrap={"wrap"}
              marginTop={"10px"}
            >
              {treatmentArea?.length > 0 &&
                treatmentArea?.map((s) => {
                  return (
                    <Box
                      padding={"5px"}
                      bg={"#79bc43"}
                      borderRadius={"5px"}
                      color={"white"}
                      cursor={"pointer"}
                    >
                      {s}
                    </Box>
                  );
                })}
            </Box>
          </Box>

          <Input
            type="number"
            value={clinicFee === 0 ? null : clinicFee}
            onChange={handleChange}
            placeholder="Enter your clinic fee in dollors (1-30)"
            bg={"white"}
            p={"5px"}
            fontSize={"18px"}
          />
          <Input
            type="number"
            value={onlineFee === 0 ? null : onlineFee}
            onChange={handleOnlineFeeChange}
            placeholder="Enter your online fee in dollors (1-10)"
            bg={"white"}
            p={"5px"}
            fontSize={"18px"}
          />
          <Input
            type="number"
            value={experienceYear === 0 ? null : experienceYear}
            onChange={(e) => {
              let value = parseInt(e.target.value, 10);
              // Ensure the value stays within the range
              if (value < 2) {
                value = 2;
              } else if (value > 25) {
                value = 25;
              }
              setExperienceYear(value);
            }}
            placeholder="Enter years of your experience (2-25)"
            bg={"white"}
            p={"5px"}
            fontSize={"18px"}
            min={2}
            max={25}
          />

          <Box display={"flex"} gap={"20px"} alignItems={"center"} w={"100%"}>
            <Button
              as="label"
              bg={"#79bc43"}
              color="white"
              width={"79%"}
              borderRadius="md"
              _hover={{ bg: "#79bc43", cursor: "pointer" }}
            >
              Add Your Degree
              <Input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                display="none"
              />
            </Button>
            <Text color={"black"} fontWeight={"500"}>
              {fileName}
            </Text>
          </Box>
          <Button
            bg={"#79bc43"}
            color="white"
            borderRadius="md"
            alignSelf={"center"}
            fontSize={"20px"}
            p={"10px"}
            onClick={handleSubmit}
            _hover={{ bg: "#79bc43", cursor: "pointer" }}
          >
            Submit your application
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default BecomeDoctorForm;
