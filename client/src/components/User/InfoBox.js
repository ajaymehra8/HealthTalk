import React, { useState, useRef, useEffect } from "react";
import { Box } from "@chakra-ui/react";

const InfoBox = ({ info, setShowBtn }) => {
  const [edit, setEdit] = useState(false);
  const [expand, setExpand] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    if (edit && contentRef.current) {
      const element = contentRef.current;
      const range = document.createRange();
      const selection = window.getSelection();

      // Set the caret at the end of the content
      range.selectNodeContents(element);
      range.collapse(false); // false = end of the range
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }, [edit]);

  const handleInput = (e) => {
    const newValue = e.target.textContent; // Get the updated value from contentEditable
    info?.handleFunction(newValue); // Update the parent state
  };

  return (
    <Box
      w={"100%"}
      borderBottom={"1px solid gray"}
      display={"flex"}
      justifyContent={"start"}
      gap={"20px"}
      pb={"10px"}
      p={"5px 5px 10px 5px"}
    >
      <h1 style={{ fontSize: "17px", width: "25%" }}>{info?.title}</h1>
      <Box
        w={"64%"}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"start"}
      >
        <h1
          ref={contentRef}
          style={{
            fontSize: "18px",
            color: info?.color ? "black" : "gray",
            outline: "none",
          }}
          contentEditable={edit}
          onInput={handleInput} // Use onInput instead of onChange
        >
          {!edit
            ? info.title === "Description"
              ? !expand
                ? info.value.slice(0, 80) + "..."
                : info.value
              : info.value
            : ""}
          {info.title === "Description" && (
            <span
              style={{ color: "blue", cursor: "pointer" }}
              onClick={() => setExpand(!expand)}
            >
              {" "}
              read {expand?"less":"more"}
            </span>
          )}
        </h1>
      </Box>
      {info.title !== "Email" && (
        <button
          style={{ color: "blue" }}
          onClick={(e) => {
            if (edit === true) {
              info?.handleFunction("");
            }
            setEdit(!edit);
          }}
        >
          {!edit ? (info?.color ? "Edit" : "Add") : "Cancel"}
        </button>
      )}
    </Box>
  );
};

export default InfoBox;
