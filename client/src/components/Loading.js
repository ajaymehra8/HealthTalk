import React from "react";
import { Box } from "@chakra-ui/react";

const Loading = () => {
  return (
    <Box
      width="100vw"
      height="100vh"
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 300 150"
        style={{ width: "clamp(100px,15%,300px)" }}
      >
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#393f4d" />
            <stop offset="100%" stopColor="#6b707a" />
          </linearGradient>
        </defs>
        <path
          fill="none"
          stroke="url(#gradient)" /* Use the gradient reference here */
          strokeWidth="15"
          strokeLinecap="round"
          strokeDasharray="300 385"
          strokeDashoffset="0"
          d="M275 75c0 31-27 50-50 50-58 0-92-100-150-100-28 0-50 22-50 50s23 50 50 50c58 0 92-100 150-100 24 0 50 19 50 50Z"
        >
          <animate
            attributeName="stroke-dashoffset"
            calcMode="spline"
            dur="2s"
            values="685;-685"
            keySplines="0 0 1 1"
            repeatCount="indefinite"
          />
        </path>
      </svg>
    </Box>
  );
};

export default Loading;
