import React, { useEffect, useState, useCallback } from "react";
import { useAuthState } from "../../context/AuthProvider";
import { Box, useToast } from "@chakra-ui/react";
import InfoBox from "../User/InfoBox";
import axios from "axios";

const DoctorInfo = ({ image }) => {
  const { user, setUser } = useAuthState();
  const [name, setName] = useState("");
  const [description, setdescription] = useState("");
  const [clinicFee, setclinicFee] = useState();
  const [onlineFee, setonlineFee] = useState();
  const [education, seteducation] = useState();
  const [showBtn, setShowBtn] = useState(false);
  const setUserInLocalStorage = useCallback(async () => {
    const userInfo = await JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);
  }, [setUser]);
  useEffect(() => {
    setUserInLocalStorage();
  }, [setUserInLocalStorage]);
  const allInfo = [
    {
      title: "Name",
      value: user?.name,
      edit: true,
      color: user?.name ? true : false,
      handleFunction: setName,
    },
    {
      title: "Email",
      value: user?.email,
      edit: false,
      color: user?.email ? true : false,
    },
    {
      title: "Description",
      value: user?.description || "Enter your description",
      edit: true,
      color: user?.description ? true : false,
      handleFunction: setdescription,
    },
    {
      title: "Clinic Fee",
      value: user?.clinicFee || "Enter your clinic fee",
      edit: true,
      color: user?.clinicFee ? true : false,
      handleFunction: setclinicFee,
    },
    {
      title: "Online Fee",
      value: user?.onlineFee || "Enter your online Fee",
      edit: true,
      color: user?.onlineFee ? true : false,
      handleFunction: setonlineFee,
    },
    {
      title: "Education",
      value: user?.education || "Enter your education",
      edit: true,
      color: user?.education ? true : false,
      handleFunction: seteducation,
    },
  ];
  const toast = useToast();
  const handleChanges = async () => {
    if (!name && !clinicFee&& !education && !description && !onlineFee && !image) {
      toast({
        title: "No field are change for update",
        status: "error",
        isClosable: true,
        duration: 500,
        position: "top",
      });
      return;
    }
    const token = user?.jwt;
    const url = `${process.env.REACT_APP_API_URL}/api/v1/user/update-doctor`;
    const form = new FormData();
    // here do all work
    if (name) form.append("name", name);
    if (clinicFee) form.append("clinicFee", clinicFee);
    if (education) form.append("education", education);
    if (description) form.append("description", description);
    if (onlineFee) form.append("onlineFee", onlineFee);
    if (image) {
      form.append("image", image); // Add the image to the form data
    }

    
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
      const obj = { ...data.user, jwt: token };
      const user = JSON.stringify(obj);
      setUser(user);
      localStorage.setItem("userInfo", user);
    }
  };
  return (
    <Box
    display={"flex"}
    flexDir={"column"}
    alignItems={"start"}
    justifyContent={"start"}
    w={"clamp(400px,80%,1000px)"}
    minH={"20vh"}
    p={"20px 20px"}
    bg={"white"}
    borderRadius={"10px"}
    pb={"30px"}
    boxShadow={"1px 1px 10px 4px #686d77"}
    >
      <h1
        style={{
          fontSize: "25px",
          marginBottom: "25px",
          fontWeight: "400",
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
        {allInfo?.map((info) => (
          <InfoBox info={info} setShowBtn={setShowBtn} />
        ))}
      </Box>
      <button
        className="defaultBtn"
        style={{ alignSelf: "center", marginTop: "20px" }}
        onClick={handleChanges}
      >
        Apply Changes
      </button>
    </Box>
  );
};

export default DoctorInfo;
