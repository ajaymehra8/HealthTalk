import { Box, Button, Input, useToast } from "@chakra-ui/react";
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { signup } from "../../Api/Auth";
import axios from "axios";
import Sidebar from "./Sidebar";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [btnState, setBtnState] = useState(1);
  const [otp, setOtp] = useState(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  window.onpopstate = () => {
    if (btnState > 1) {
      setBtnState(btnState - 1);
    } else {
      navigate("/");
    }
  };
  const handleSubmit = async (e) => {
    // FOR GET OTP
    if (e.target.innerText === "Next") {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/v1/user/otp-verification/?email=${email}`
        );
        if (data.success) {
          toast({
            title: data.message,
            status: "success",
            isClosable: true,
            duration: 5000,
            position: "top",
          });
          setBtnState(2);
        } else {
          toast({
            title: data.message || "An error occurred",
            status: "error",
            isClosable: true,
            duration: 5000,
            position: "top",
          });
          setEmail("");
        }
      } catch (err) {
        console.log(err);
        toast({
          title: err.response.data.message || "An error occurred",
          status: "error",
          isClosable: true,
          duration: 5000,
          position: "top",
        });
      }
    }
    // TO VERIFY OTP
    if (e.target.innerText === "Verify OTP") {
      try {
        const { data } = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/v1/user/otp-verification`,
          { email, otp }
        );
        if (data.success) {
          toast({
            title: data.message || "An error occurred",
            status: "success",
            isClosable: true,
            duration: 5000,
            position: "top",
          });
          setBtnState(3);
        } else {
          toast({
            title: data.message || "An error occurred",
            status: "error",
            isClosable: true,
            duration: 5000,
            position: "top",
          });
        }
      } catch (err) {
        toast({
          title: err.response.data.message || "An error occurred",
          status: "error",
          isClosable: true,
          duration: 5000,
          position: "top",
        });
      }
    }
    // when user in at SIGN UP STEP
    if (e.target.innerText === "Sign up") {
      try {
        const data = await signup({ name, email, password });
        if (!data.success) {
          toast({
            title: data.message || "An error occurred",
            status: "error",
            isClosable: true,
            duration: 5000,
            position: "top",
          });
          setEmail("");
        } else {
          const obj = { ...data.user, jwt: data.token };
          const user = JSON.stringify(obj);
          localStorage.setItem("userInfo", user);
          toast({
            title: "Signup successful",
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
        setEmail("");
      }
    }
  };

  return (
    <Box
      h={"100vh"}
      w={"100vw"}
      background={"#ffffff"}
      display={"flex"}
      alignItems={"center"}
      justifyContent={"center"}
    >
      <Box
        boxSizing="border-box"
        w={{sm:"100%",md:"50%",lg:"30%"}}
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
          to={"/login"}
          style={{
            fontSize: "20px",
            fontWeight: "500",
            marginBottom: "20px",
            marginTop: "-20px",
          }}
        >
          Have an Account? <span style={{ color: "blue" }}>Log in</span>
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
          p={"10px"}
          borderRadius={"10px"}
          border={"1px solid black"}
          outline={"none"}
          w={"90%"}
          minW={"80px"}
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          fontSize={"20px"}
          bg={"white"}
          disabled={btnState > 1}
          _hover={{
            border: "1px solid black",
          }}
          _focus={{
            border: "1px solid black !important",
            boxShadow: "none !important",
          }}
          _disabled={{
            backgroundColor: "white", // Light red background
            border: "1px solid black", // Dashed border
            borderRadius: "10px",
            cursor: "not-allowed", // Not allowed cursor
            opacity: 1, // Full opacity
          }}
        />

        {btnState === 2 && (
          <Input
            type="number"
            placeholder="Enter your otp"
            onChange={(e) => setOtp(e.target.value)}
            borderRadius={"10px"}
            border={"1px solid black"}
            outline={"none"}
            w={"90%"}
            minW={"80px"}
            fontSize={"20px"}
            bg={"white"}
            value={otp}
            _hover={{
              border: "1px solid black",
            }}
            _focus={{
              border: "1px solid black !important",
              boxShadow: "none !important",
            }}
            css={{
              "&::-webkit-inner-spin-button": {
                WebkitAppearance: "none",
                margin: 0,
              },
              "&::-webkit-outer-spin-button": {
                WebkitAppearance: "none",
                margin: 0,
              },
              "&": { MozAppearance: "textfield" }, // For Firefox
            }}
          />
        )}
        {btnState === 3 && (
          <>
            <Input
              type="text"
              placeholder="Enter your name"
              p="10px"
              borderRadius="10px"
              border={"1px solid black"}
              outline="none"
              bg="white"
              w="90%"
              onChange={(e) => setName(e.target.value)}
              value={name}
              minW="80px"
              fontSize="20px"
              _hover={{
                border: "1px solid black",
              }}
              _focus={{
                border: "1px solid black !important",
                boxShadow: "none !important",
              }}
            />
            <Input
              type="password"
              placeholder="Enter your password"
              p="10px"
              borderRadius="10px"
              border={"1px solid black"}
              outline="none"
              w="90%"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              minW="80px"
              bg="white"
              fontSize="20px"
              _hover={{
                border: "1px solid black",
              }}
              _focus={{
                border: "1px solid black !important",
                boxShadow: "none !important",
              }}
            />
          </>
        )}

        <button
          className="authBtn"
          onClick={handleSubmit}
          style={{
            alignSelf: "flex-start",
            minWidth: "80px",
            marginTop: "30px",
          }}
        >
          {btnState === 1 && "Next"}
          {btnState === 2 && "Verify OTP"}
          {btnState === 3 && "Sign up"}
        </button>
      </Box>
      <Sidebar />
    </Box>
  );
};

export default Signup;
