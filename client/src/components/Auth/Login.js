import React, { useState, useEffect } from "react";
import {
  Box,
  Input,
  InputGroup,
  useToast,
  InputRightElement,
  Button,
  useBreakpointValue,
} from "@chakra-ui/react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { login } from "../../Api/Auth";
import { useAuthState } from "../../context/AuthProvider";
import Sidebar from "./Sidebar";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";

const Login = () => {
  const { user, setUser } = useAuthState();
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  window.onpopstate = () => {
    navigate("/");
  };
  const responseGoogle = async (authResult) => {
    try {
      if (authResult?.code) {
        const result = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/v1/user/google-auth?code=${authResult?.code}`
        );
        if(result.data.success){
          const obj = { ...result?.data?.user, jwt: result?.data?.token };
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
      }
    } catch (err) {
      console.log(err);
      alert(err.message);
    }
  };
  const googleLoginHandle = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  });
  const emailPlaceholderText =
    useBreakpointValue({
      lg: "Enter your email",
      md: "Enter your email",
      sm: "Email",
    }) || "Email";
  const passwordPlaceholderText =
    useBreakpointValue({
      lg: "Enter your password",
      md: "Enter your password",
      sm: "Password",
    }) || "Password";

  const handleSubmit = async () => {
    try {
      setLoading(true);
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
    setLoading(false);
  };
  return (
    <Box
      height={"100vh"}
      className="loginBox"
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
        className="loginModal"
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
            fontSize: "clamp(20px,3vw,30px)",
            letterSpacing: "1px",
            fontWeight: "400",
          }}
        >
          Login to your account
        </h2>
        <NavLink
          to={"/signup"}
          style={{
            fontSize: "clamp(16px,1.5vw,20px)",
            fontWeight: "500",
            marginBottom: "20px",
            marginTop: "-20px",
          }}
        >
          Have an Account. <span style={{ color: "blue" }}>Create one</span>
        </NavLink>
        <Button
          p={"10px"}
          borderRadius={"10px"}
          border={"1px solid black"}
          width={"clamp(150px,90%,1000px)"}
          onClick={googleLoginHandle}
          fontSize={"clamp(15px,3vw,20px)"}
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
        
        <h1 style={{ alignSelf: "center", marginRight: "40px" }}>Or</h1>
        <Input
          type="email"
          placeholder={emailPlaceholderText}
          p={"10px "}
          borderRadius={"10px"}
          border={"1px solid black"}
          outline={"none"}
          width={"clamp(150px,90%,1000px)"}
          minW={"80px"}
          fontSize={"clamp(15px,3vw,20px)"}
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
          autoComplete="email"
          name="email"
        />
        <InputGroup width={"clamp(150px,90%,1000px)"}>
          <Input
            type={!showPass ? "password" : "text"}
            placeholder={passwordPlaceholderText}
            p={"10px"}
            borderRadius={"10px"}
            border={"1px solid black"}
            outline={"none"}
            width={"100%"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fontSize={"clamp(15px,3vw,20px)"}
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
          onClick={!loading ? handleSubmit : undefined}
          style={{
            minWidth: "80px",
            marginTop: "30px",
            background: loading && "gray",
            disabled: { loading },
            cursor: loading && "not-allowed",
            borderColor: loading && "gray",
          }}
        >
          {!loading ? "Log in" : "Wait..."}
        </button>
      </Box>
      <Sidebar />
    </Box>
  );
};

export default Login;
