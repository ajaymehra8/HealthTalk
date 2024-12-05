import React, { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import { useAuthState } from "../context/AuthProvider";
import Signup from "../components/Auth/Signup";
import axios from "axios";
import DocProf from "../components/Doctors/DocProf";
import Navbar from "../components/Navbar";
import Doctors from "./Doctors";
import Testimonial from "./Testimonial";
import Footer from "../components/Footer";
import { Link } from "react-scroll";

const Home = () => {
  const { user } = useAuthState();
  const [doctors, setDoctors] = useState([]);
  const fetchDoctors = async () => {
    const { data } = await axios(`${process.env.REACT_APP_API_URL}/api/v1/user`);
    setDoctors(data.doctors);
  };
  useEffect(() => {
    fetchDoctors();
  }, []);
  return (
    <>
      <Navbar />
      <Box
        minH={"95vh"}
        w={"100vw"}
        background={"linear-gradient(to right, #393f4d, #6b707a)"}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-evenly"}
        pb={"50px"}
        pt={"60px"}
        position={"relative"}
      >
        <Box width={"40%"}>
          <h1
            style={{
              color: "white",
              fontSize: "40px",
              fontWeight: "700",
              letterSpacing: "1px",
            }}
          >
            Guiding you to a<span style={{ color: "#78be20" }}> stronger</span>{" "}
            organization with better patient outcomes
          </h1>
          <Box marginTop={'30px'}>
          <Link
            className="homePageBtn"
            to="doctors"
            smooth={true}
            duration={500}
          >
            Explore Now
          </Link>
        </Box>
        </Box>
        <img
          src="../images/doctorHomeImg.png"
          alt=""
          style={{ width: "42vw" }}
        />
        <div className="homeFoot">
          <h1>
            <span>HealthTalk</span> Find, Connect, and Consult with Top Doctors
          </h1>
        </div>
      </Box>
      <Doctors id="doctors" />
      <Testimonial />
      <Footer />
    </>
  );
};

export default Home;
