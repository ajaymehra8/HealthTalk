import React, { useState, useEffect } from "react";
import {
  Box,
  Input,
  InputGroup,
  useToast,
  InputRightElement,
} from "@chakra-ui/react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { login } from "../../Api/Auth";
import { useAuthState } from "../../context/AuthProvider";

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
  }
  
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
          p={"10px "}
          borderRadius={"10px"}
          border={"none"}
          outline={"none"}
          w={"90%"}
          minW={"80px"}
          fontSize={"20px"}
          value={email}
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
            border={"none"}
            outline={"none"}
            w={"100%"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fontSize={"20px"}
            bg={"white"}
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

        <button className="authBtn" onClick={handleSubmit}>
          Log in
        </button>
        <NavLink to={"/signup"}>New here? Create account</NavLink>
      </Box>
    </Box>
  );
};

export default Login;
