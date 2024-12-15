import React from "react";
import { Avatar, Box, Tooltip,useToast } from "@chakra-ui/react";
import { useAuthState } from "../context/AuthProvider";
import { NavLink, useNavigate} from "react-router-dom";

const Navbar = () => {
  const { user, setUser } = useAuthState();
  const toast=useToast();
  const navigate = useNavigate();
  const handleLogin = () => {
    navigate("/login");
  };
  const handleLogOut = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
  toast({
    title:"Log out successfully",
    status: "success",
    isClosable: true,
    duration: 10000,
  })
    navigate("/");
  };
  return (
    <Box
      w={"100vw"}
      boxShadow="0px 4px 8px black"
      display={"flex"}
      alignItems={"center"}
      justifyContent={"space-between"}
      bg={"white"}
      p={"5px 20px"}
      position={"fixed"}
      top={"0"}
      zIndex={"5"}
    >
      <h1
        className="logo"
        style={{ cursor: "pointer" }}
        onClick={() => {
          navigate("/");
        }}
      >
        <span className="logo-span">H</span>ealth
        <span className="logo-span">T</span>alk
      </h1>
      <ul className="navLinks">
        {user && (
          <li className="navLink" onClick={handleLogOut}>
            <NavLink>Logout</NavLink>
          </li>
        )}
        {!user && (
          <>
            <li className="navLink" onClick={handleLogin}>
              <NavLink>Login</NavLink>
            </li>
            <li className="navLink" onClick={() => navigate("/signup")}>
              <NavLink>Signup</NavLink>
            </li>
          </>
        )}

        {user && (
          <Tooltip label="Your Profile" placement="bottom">
            <li className="navLink">
              <NavLink to={"/my-profile"}>
                <Avatar src={user?.image} size={"sm"} />{" "}
              </NavLink>
            </li>
          </Tooltip>
        )}
      </ul>
    </Box>
  );
};

export default Navbar;
