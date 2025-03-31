import React, { useState } from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useToast,
} from "@chakra-ui/react";
import { useAuthState } from "../../context/AuthProvider";
import axios from "axios";

function ReportModal({ isOpen, onOpen, onClose, doctorId }) {
  const { user } = useAuthState();
  const [report, setReport] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const handleReport = async () => {
    const token = user?.jwt;
    if (!user) {
      toast({
        title: "Please logged in first",
        status: "warning",
        isClosable: true,
        duration: 5000,
        position: "top",
      });
      return;
    }
    if (!token) {

      return;
    }

    setLoading(true);
    try {
      const headers = {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      };
      if (report.length <= 3) {
        toast({
          title: "Write a valid report",
          status: "warning",
          isClosable: true,
          duration: 5000,
          position: "top",
        });
        setLoading(false);
        return;
      }
      const body = {
        report,
        doctorId: doctorId,
      };
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/v1/report`,
        body,
        { headers }
      );
      if (data.success) {
        toast({
          title: data.message,
          status: "success",
          isClosable: true,
          duration: 5000,
          position: "top",
        });
        setReport("");
        onClose();
      } else {
        console.log(data);
      }
    } catch (err) {
      toast({
        title: err.response.data.message,
        status: "error",
        isClosable: true,
        duration: 5000,
        position: "top",
      });
    }
    setLoading(false);
  };
  return (
    <>
      {/* Button to Open Modal */}

      {/* Modal Component */}
      <Modal isOpen={isOpen} onClose={onClose} alignSelf="center">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Report</ModalHeader>
          <ModalCloseButton />
          <ModalBody paddingTop={"-10px"}>
            <textarea
              placeholder="Write a report here."
              style={{
                width: "100%",
                border: "1px solid black",
                borderRadius: "10px",
                padding: "5px 10px",
              }}
              value={report}
              rows={"4"}
              onChange={(e) => {
                setReport(e.target.value);
              }}
            ></textarea>
          </ModalBody>
          <ModalFooter>
            <Button
              mr={3}
              onClick={!loading ? handleReport : undefined}
              background={loading ? "gray" : "#3182ce"}
              disabled={loading}
              cursor={loading ? "disabled" : "pointer"}
              color={"white"}
              _hover={{
                bg: loading ? "gray" : "#3182ce",
                cursor: loading ? "disabled" : "pointer",
              }}
            >
              {!loading ? "Report" : "Wait..."}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ReportModal;
