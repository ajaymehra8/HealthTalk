import React, { useEffect, useState, useCallback } from "react";
import { useAuthState } from "../../context/AuthProvider";
import { Box, useToast } from "@chakra-ui/react";
import InfoBox from "./InfoBox";
import axios from "axios";

const UserInfoCard = ({ image }) => {
  const { user, setUser } = useAuthState();
  const [name, setName] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [showBtn, setShowBtn] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  // Sync user from localStorage during initialization
  const setUserInLocalStorage = useCallback(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {
      setUser(userInfo);
    }
  }, [setUser]);

  useEffect(() => {
    setUserInLocalStorage();
  }, [setUserInLocalStorage]);

  // Prepare the information array
  const allInfo = [
    {
      title: "Name",
      value: user?.name || "Enter your name",
      edit: true,
      color: Boolean(user?.name),
      handleFunction: setName,
    },
    {
      title: "Email",
      value: user?.email,
      edit: false,
      color: Boolean(user?.email),
    },
    {
      title: "Blood Group",
      value: user?.bloodGroup || "Enter your blood group",
      edit: true,
      color: Boolean(user?.bloodGroup),
      handleFunction: setBloodGroup,
    },
    {
      title: "Age",
      value: user?.age || "Enter your age",
      edit: true,
      color: Boolean(user?.age),
      handleFunction: setAge,
    },
    {
      title: "Height",
      value: user?.height || "Enter your height",
      edit: true,
      color: Boolean(user?.height),
      handleFunction: setHeight,
    },
    {
      title: "Weight",
      value: user?.weight || "Enter your weight",
      edit: true,
      color: Boolean(user?.weight),
      handleFunction: setWeight,
    },
  ];

  const handleChanges = async () => {
    if (!name && !age && !weight && !bloodGroup && !height && !image) {
      toast({
        title: "No fields have been changed.",
        status: "error",
        isClosable: true,
        duration: 500,
        position: "top",
      });
      return;
    }

    const token = user?.jwt;
    if (!token) return;
    const url = `${process.env.REACT_APP_API_URL}/api/v1/user`;
    const form = new FormData();

    if (name) form.append("name", name);
    if (age) form.append("age", age);
    if (weight) form.append("weight", weight);
    if (bloodGroup) form.append("bloodGroup", bloodGroup);
    if (height) form.append("height", height);
    if (image) form.append("image", image);
    setLoading(true);
    try {
      const { data } = await axios.patch(url, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (data.success) {
        toast({
          title: "Details updated successfully",
          status: "success",
          isClosable: true,
          duration: 5000,
          position: "top",
        });

        const updatedUser = { ...data.user, jwt: token };
        setUser(updatedUser); // Update state
        localStorage.setItem("userInfo", JSON.stringify(updatedUser)); // Sync local storage
      }
    } catch (error) {
      toast({
        title: "Failed to update details.",
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
      display={"flex"}
      flexDir={"column"}
      alignItems={"start"}
      justifyContent={"start"}
      w={"clamp(320px,90%,1000px)"}
      minH={"45vh"}
      height={'auto'}
            p={"2px 20px"}
            pt={'10px'}
            pb={'1vh'}
      bg={"white"}
      borderRadius={"10px"}
      boxShadow={"1px 1px 10px 4px #686d77"}
      sx={{
        "@media(max-width:500px)":{
          minHeight:"63vh",
        },
      }}
    >
      <h1
        style={{
          fontSize: "clamp(20px,3vw,30px)",
          marginBottom: "15px",
          fontWeight: "500",
          letterSpacing: "1px",
        }}
      >
        Your Info
      </h1>
      <Box
        w={"100%"}
        display={"flex"}
        flexDir={"column"}
        alignItems={"center"}
        justifyContent={"center"}
        gap={"20px"}
      >
        {allInfo?.map((info, idx) => (
          <InfoBox key={idx} info={info} setShowBtn={setShowBtn} />
        ))}
      </Box>
      <button
        className="defaultBtn"
        style={{
          alignSelf: "center",
          marginTop: "20px",
          marginBottom:"0",
          cursor: loading && "not-allowed",
          background: loading && "gray",
          borderColor:loading && "gray"
        }}
        onClick={!loading?handleChanges:undefined}
        disabled={loading}
      >
        {!loading ? "Apply Changes" : "Updating..."}
      </button>
    </Box>
  );
};

export default UserInfoCard;
