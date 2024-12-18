import { Box, Image } from "@chakra-ui/react";
import React from "react";
import { Link } from "react-router-dom";
const Sidebar = () => {
  return (
    <Box
      bg={"linear-gradient(to right, #393f4d, #6b707a)"}
      width={{  md: "50%", lg: "70%" }}
      h={"100vh"}
      display={{lg:"flex",md:"flex",sm:"none"}}
      justifyContent={"start"}
      alignItems={"start"}
      flexDir={{lg:"row",md:"column-reverse"}}
      className="test"
    >
      <Box
        width={{lg:"35%"}}
        height={"100%"}
        display={{lg:"flex",md:"flex"}}
        flexDirection={"column"}
        justifyContent={"start"}
        alignItems={"start"}
        p={{lg:"80px 20px 0",md:"50px 20px 0"}}
      >
        <h1
          style={{
            color: "white",
            fontSize: "clamp(20px,5vw,30px)",
            fontWeight: "700",
            letterSpacing: "1px",
          }}
        >
          Doctor's are here.
        </h1>
        <p
          style={{
            color: "white",
            fontSize: "clamp(10px,2vw,15px)",
            fontWeight: "400",
            letterSpacing: "2px",
            textAlign: "justify",
            alignSelf: "center",
          }}
        >
          Connect with expert doctors, prioritize your health, and enjoy
          affordable care—sign up today.
        </p>
        <Box marginTop={"30px"}>
          <Link
            className="homePageBtn"
            to="/"
            style={{ background: "#785af9", borderRadius: "100px" }}
            smooth={true}
            duration={500}
          >
            Explore Now
          </Link>
        </Box>
      </Box>
      <Box
        width={{lg:"65%",md:"100%"}}
        height={"100%"}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"start"}
        pt={"80px"}
      >
        <Image
          src="https://static.vecteezy.com/system/resources/previews/012/140/570/non_2x/group-of-medical-staff-at-hospital-handsome-doctor-in-front-of-team-free-photo.jpg"
          alt=""
          style={{
            width:"90%",
            borderRadius:"100px 0 100px 0"
          }}
          height={{lg:"80%",md:"100%"}}
        />
      </Box>
    </Box>
  );
};

export default Sidebar;
