import { Box, Button, Input, useToast } from "@chakra-ui/react";
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { signup } from "../../Api/Auth";
import axios from "axios";

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
    navigate("/");
  }
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
      background={"#785af9"}
      display={"flex"}
      flexDir={"column"}
      alignItems={"center"}
      justifyContent={"center"}
    >
      <Box
        p={"30px 0"}
        boxSizing="border-box"
        w={"30%"}
        display={"flex"}
        flexDir={"column"}
        alignItems={"center"}
        justifyContent={"center"}
        gap={"25px"}
        bg={"#d9caff"}
        minW={"250px"}
        borderRadius={"10px"}
      >
        <Input
          type="email"
          placeholder="Enter your email"
          p={"10px"}
          borderRadius={"10px"}
          border={"none"}
          outline={"none"}
          w={"90%"}
          minW={"80px"}
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          fontSize={"20px"}
          bg={"white"}
          disabled={btnState > 1}
          _disabled={{
            backgroundColor: "white", // Light red background
            border: "none", // Dashed border
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
            border={"none"}
            outline={"none"}
            w={"90%"}
            minW={"80px"}
            fontSize={"20px"}
            bg={"white"}
            value={otp}
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
              border="none"
              outline="none"
              bg="white"
              w="90%"
              onChange={(e) => setName(e.target.value)}
              value={name}
              minW="80px"
              fontSize="20px"
            />
            <Input
              type="password"
              placeholder="Enter your password"
              p="10px"
              borderRadius="10px"
              border="none"
              outline="none"
              w="90%"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              minW="80px"
              bg="white"
              fontSize="20px"
            />
          </>
        )}

        <button className="authBtn" onClick={handleSubmit}>
          {btnState === 1 && "Next"}
          {btnState === 2 && "Verify OTP"}
          {btnState === 3 && "Sign up"}
        </button>
        <NavLink to={"/login"}>Have an Account? Log in.</NavLink>
      </Box>
    </Box>
  );
};

export default Signup;
