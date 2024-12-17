import React, { useState, useEffect } from "react";
import {
  Box,
  Input,
  InputGroup,
  useToast,
  InputRightElement,
  Button,
} from "@chakra-ui/react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { login } from "../../Api/Auth";
import { useAuthState } from "../../context/AuthProvider";
import Sidebar from "./Sidebar";

const Login = () => {
  const { user, setUser } = useAuthState();
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [showPass, setShowPass] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  window.onpopstate = () => {
    navigate("/");
  };

  const handleSubmit = async () => {
    try {
      const data = await login({ email, password });

      if (!data.success) {
        toast({
          title: data.message || "An error occurred",
          status: "error",
          isClosable: true,
          duration: 10000,
        });
      } else {
        const obj = { ...data.user, jwt: data.token };
        const user = JSON.stringify(obj);
        localStorage.setItem("userInfo", user);
        setUser(obj);
        toast({
          title: "Login successfully",
          status: "success",
          isClosable: true,
          duration: 5000,
          position: "top",
        });
        navigate("/");
      }
    } catch (error) {
      toast({
        title: error.response.data.message,
        description: "Please try again later.",
        status: "error",
        isClosable: true,
        duration: 5000,
        position: "top",
      });
    }
  };
  return (
    <Box
      h={"100vh"}
      w={"100vw"}
      background={"#fff"}
      display={"flex"}
      alignItems={"center"}
      justifyContent={"center"}
    >
      <Box
        boxSizing="border-box"
        w={{ sm: "100%", md: "50%", lg: "30%" }}
        display={"flex"}
        flexDir={"column"}
        alignItems={"start"}
        justifyContent={"start"}
        gap={"15px"}
        bg={"#ffffff"}
        minW={"50px"}
        borderRadius={"10px"}
        paddingLeft={"40px"}
      >
        <h1
          className="logo"
          style={{
            cursor: "pointer",
            marginBottom: "20px",
            fontSize: "clamp(30px, 5vw, 30px)",
          }}
          onClick={() => {
            navigate("/");
          }}
        >
          <span className="logo-span">H</span>ealth
          <span className="logo-span">T</span>alk
        </h1>

        <h2
          style={{
            fontSize: "30px",
            letterSpacing: "1px",
            fontWeight: "400",
          }}
        >
          Create your account
        </h2>
        <NavLink
          to={"/signup"}
          style={{
            fontSize: "20px",
            fontWeight: "500",
            marginBottom: "20px",
            marginTop: "-20px",
          }}
        >
          Not Have an Account? <span style={{ color: "blue" }}>Create one</span>
        </NavLink>
        <Button
          p={"10px"}
          borderRadius={"10px"}
          border={"1px solid black"}
          w={"90%"}
          minW={"80px"}
          onClick={() => console.log("clicked")}
          fontSize={"20px"}
          bg={"white"}
        >
          {" "}
          <img
            src="https://img.icons8.com/?size=100&id=17949&format=png&color=000000"
            alt=""
            style={{ width: "25px", marginRight: "5px" }}
          />{" "}
          Google
        </Button>
        <Button
          p={"10px"}
          borderRadius={"10px"}
          border={"1px solid black"}
          w={"90%"}
          minW={"80px"}
          onClick={() => console.log("clicked")}
          fontSize={"20px"}
          bg={"white"}
        >
          <i
            className="bi bi-facebook"
            style={{ color: "#0c69ff", marginRight: "5px" }}
          ></i>{" "}
          Facebook
        </Button>
        <h1 style={{ alignSelf: "center", marginRight: "40px" }}>Or</h1>
        <Input
          type="email"
          placeholder="Enter your email"
          p={"10px "}
          borderRadius={"10px"}
          border={"1px solid black"}
          outline={"none"}
          w={"90%"}
          minW={"80px"}
          fontSize={"20px"}
          value={email}
          _hover={{
            border: "1px solid black",
          }}
          _focus={{
            border: "1px solid black !important",
            boxShadow: "none !important",
          }}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          bg={"white"}
        />
        <InputGroup w={"90%"} minW={"80px"}>
          <Input
            type={!showPass ? "password" : "text"}
            placeholder="Enter your password"
            p={"10px"}
            borderRadius={"10px"}
            border={"1px solid black"}
            outline={"none"}
            w={"100%"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fontSize={"20px"}
            bg={"white"}
            _hover={{
              border: "1px solid black",
            }}
            _focus={{
              border: "1px solid black !important",
              boxShadow: "none !important",
            }}
          />
          <InputRightElement width="4.5rem">
            <button
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                fontSize: "14px",
                color: "blue",
              }}
              onClick={() => setShowPass(!showPass)}
            >
              {!showPass ? "Show" : "Hide"}
            </button>
          </InputRightElement>
        </InputGroup>

        <button
          className="authBtn"
          onClick={handleSubmit}
          style={{
            minWidth: "80px",
            marginTop: "30px",
          }}
        >
          Log in
        </button>
      </Box>
      <Sidebar />
    </Box>
  );
};

export default Login;
