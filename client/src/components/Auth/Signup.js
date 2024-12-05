import { Box, Button, Input, useToast } from "@chakra-ui/react";
import React, { useState } from "react";
import { NavLink,useNavigate } from "react-router-dom";
import { signup } from "../../Api/Auth";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading,setLoading]=useState(false);
  const toast = useToast();
const navigate=useNavigate();
  const handleSubmit = async () => {
    try {
      const data = await signup({ name, email, password });
      if (!data.success) {
        toast({
          title: data.message || "An error occurred",
          status: 'error',
          isClosable: true,
          duration: 10000,
        });
      } else {
        const obj={...data.user,jwt:data.token}
        const user=JSON.stringify(obj);
        localStorage.setItem('userInfo',user);
        toast({
          title: "Signup successful",
          status: 'success',
          isClosable: true,
          duration: 5000,
          position: 'top',
        });
        navigate("/");

      }
    } catch (error) {
      toast({
        title: error.response.data.message,
        description: "Please try again later.",
        status: 'error',
        isClosable: true,
        duration: 5000,
        position: 'top',
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
        gap={'25px'}
        bg={'#d9caff'}
        minW={'250px'}
        borderRadius={'10px'}
      >
        <Input
          type="email"
          placeholder="Enter your email"
          p={"10px "}
          borderRadius={"10px"}
          border={"none"}
          outline={"none"}
          w={'90%'}
          minW={'80px'}
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          fontSize={'20px'}
          bg={'white'}
        />
        <Input
          type="text"
          placeholder="Enter your name"
          p={"10px "}
          borderRadius={"10px"}
          border={"none"}
          outline={"none"}
          bg={'white'}

          w={'90%'}
          onChange={(e) => setName(e.target.value)}
          minW={'80px'}
          value={name}
          fontSize={'20px'}
        />
        <Input
          type="password"
          placeholder="Enter your password"
          p={"10px "}
          borderRadius={"10px"}
          border={"none"}
          outline={"none"}
          w={'90%'}
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          minW={'80px'}
          bg={'white'}
 
          fontSize={'20px'}
        />
        <button className="authBtn" onClick={handleSubmit}>Sign up</button>
        <NavLink to={'/login'}>Have an Account? Log in.</NavLink>
      </Box>
    </Box>
  );
};

export default Signup;
