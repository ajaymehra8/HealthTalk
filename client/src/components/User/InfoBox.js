import React, { useState, useRef, useEffect } from "react";
import { Box } from "@chakra-ui/react";

const InfoBox = ({ info}) => {
  const [edit, setEdit] = useState(false);
  const [expand, setExpand] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    if (edit && contentRef.current) {
      const element = contentRef.current;
      element.focus(); // Focus on the contentEditable element
      
      const range = document.createRange();
      const selection = window.getSelection();

      // Move the caret to the end of the content
      range.selectNodeContents(element);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }, [edit]);

  const handleInput = (e) => {
    const newValue = e.target.textContent;
    info?.handleFunction(newValue);
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
      <Box w={"64%"} display={"flex"} alignItems={"center"} justifyContent={"start"}>
      <h1
  ref={contentRef}
  style={{
    fontSize: "18px",
    color: info?.color ? "black" : "gray",
    outline: "none",
  }}
  contentEditable={edit}
  suppressContentEditableWarning={true}
  onInput={handleInput}
>
  {!edit ? (
    info.title === "Description" ? (
      info.value.length > 80 ? (
        expand ? info.value : info.value.slice(0, 80) + "..."
      ) : (
        info.value
      )
    ) : (
      info.value
    )
  ) : (
    info.value // Show the value while editing
  )}
</h1>

{info.title === "Description" && info.value.length > 80 && !edit && (
  <span
    style={{ color: "blue", cursor: "pointer", marginLeft: "5px" }}
    onClick={() => setExpand(!expand)}
  >
    read {expand ? "less" : "more"}
  </span>
)}

      </Box>
      {info.title !== "Email" && (
        <button
          style={{ color: "blue" }}
          onClick={() => {
            if (edit) {
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
