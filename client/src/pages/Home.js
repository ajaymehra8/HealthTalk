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
import Loading from "../components/Loading";

const Home = () => {
const {mainLoading,setMainLoading}=useAuthState();
  const [doctors, setDoctors] = useState(null);

 const getDoctor = async () => {
    try {
      setMainLoading(true); // Set main loading to true
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/user`
      );
      setDoctors(data.doctors);
    } catch (error) {
      console.error("Failed to fetch doctors:", error);
    } finally {
      setMainLoading(false); // Set main loading to false in the end
    }
  };

  useEffect(() => {
    getDoctor(); // Fetch data on component mount
  }, []); // Dependency array ensures it runs only once
if(mainLoading){
  return <Loading/>;
}
  return (
    <>
      <Navbar />
      <Box
        height={"95vh"}
        w={"100vw"}
        background={"linear-gradient(to right, #393f4d, #6b707a)"}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-evenly"}
        pb={"50px"}
        pt={"60px"}
        position={"relative"}
        className="homePageMain"
      >
        <Box width="40%" className="homeTextBox">
          <h1
            style={{
              color: "white",
              fontSize: "clamp(30px,4vw,40px)",
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
          className="homeImg"
        />
        <div className="homeFoot">
          <h1>
            <span>HealthTalk</span> Find, Connect, and Consult with Top Doctors
          </h1>
        </div>
      </Box>
      <Doctors id="doctors" doctors={doctors}/>
      <Testimonial />
      <Footer />
    </>
  );
};

export default Home;
