import { Box, Divider } from "@chakra-ui/react";
import React from "react";
import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <Box
      width={"100%"}
      mt={"30px"}
      display={"flex"}
      flexDir={"column"}
      gap={"5px"}
      p={"10px 0"}
      paddingBottom={"20px"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Box
        width={"100%"}
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <h1 className="logo" style={{ cursor: "pointer", marginLeft: "50px" }}>
          <span className="logo-span">H</span>ealth
          <span className="logo-span">T</span>alk
        </h1>
        <ul className="navLinks">
          <li
            className="navLink"
            style={{
              fontSize: "15px",
              letterSpacing: "1px",
              fontWeight: "400",
            }}
          >
            <NavLink>About us</NavLink>
          </li>
          <li
            className="navLink"
            style={{
              fontSize: "15px",
              letterSpacing: "1px",
              fontWeight: "400",
            }}
          >
            <NavLink>Be a part of our team</NavLink>
          </li>
        </ul>
      </Box>
      <Box
        width={"100%"}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        gap={"30px"}
      >
        <NavLink className={"footerLink fb"}>
          <i class="bi bi-facebook"></i>
        </NavLink>
        <NavLink className={"footerLink insta"}>
          <i class="bi bi-instagram"></i>
        </NavLink>
        <NavLink className={"footerLink linkdin"}>
          <i class="bi bi-linkedin"></i>
        </NavLink>
      </Box>
      <Divider borderColor="#black"  />
      <p>
        © 2024{" "}
        <h1 className="logo" style={{ cursor: "pointer",display:'inline',fontSize:'15   px',fontWeight:'400' }}>
          <span className="logo-span">H</span>ealth
          <span className="logo-span">T</span>alk
        </h1>
      </p>
    </Box>
  );
};

export default Footer;
