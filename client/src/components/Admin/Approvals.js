import React from "react";
import { useAuthState } from "../../context/AuthProvider";
import { Box } from "@chakra-ui/react";
import ReqCard from "../Approval/ReqCard";
const Approvals = () => {
  const { user } = useAuthState();
  return (
    <Box
      display={"flex"}
      flexDir={"column"}
      alignItems={"start"}
      justifyContent={"start"}
      w={"70%"}
      minH={"80vh"}
      maxH={"80vh"}
      p={"20px"}
      pt={"40px"}
      bg={"white"}
      borderRadius={"10px"}
      pb={"30px"}
      boxShadow={"1px 1px 10px 4px #686d77"}
      overflowY={"auto"}
    >
      {user?.reqs.length > 0 ? (
        user?.reqs.map((req) => <ReqCard req={req} />)
      ) : (
        <h1 className="no-item-text">No Requests Yet.</h1>
      )}
    </Box>
  );
};

export default Approvals;
