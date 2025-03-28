import React, { useRef } from "react";
import { Box, Avatar } from "@chakra-ui/react";
import { useAuthState } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";

const ProfSideBar = ({ imageSrc, setImageSrc, imageFile, setImageFile }) => {
  const { user, show, setShow } = useAuthState();
  const navigate = useNavigate();

  const fileInputRef = useRef(null); // Create a reference for the input

  // Handle file input change
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file); // Store the actual file

      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result); // Set the image as a base64 URL
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    }
  };

  // Trigger the input click when Avatar is clicked
  const handleAvatarClick = () => {
    fileInputRef.current.click(); // Simulate input click
  };

  const handleApplication = async () => {
    navigate("/doctor/form");
  };
  const changeShow = () => {
    setShow(false);
  };
  return (
    <>
      <div
        className="usResBtn"
        style={{
          position: "absolute",
          left: !show ? "-40px" : "clamp(100px, 50%, 260px)",
        }}
        onClick={() => {
          setShow(!show);
        }}
      ></div>
      <Box
        className="userCard"
        flexDir={"column"}
        w={"22%"}
        minH={"100vh"}
        borderRight={"2px solid white"}
        boxShadow="5px 0 25px -10px rgba(0, 0, 0, 0.5)" // Shadow on the right side
        position={{ base: "absolute", md: "fixed" }}
        left={{base:!show ? "-80%" : "0",lg:0}}
        
        top={{md:'0'}}
        pt={"70px"}
        z-index={1000}
        sx={{
          "@media(max-width:950px)": {
            width: "clamp(200px,60%,300px)",
            position: "absolute",
            maxHeight:"1000px",
minHeight:"40px",
            height: "90vh",
            border: "none",
            borderRadius: "0 0 30px",
          },
          "@media(max-width:500px)": {
            top:0,
            maxHeight:"800px",
            minHeight:"300px",
            height: "85vh",
          },
        }}
      >
        <Box className="flexBox" flexDir={"column"} gap={"10px"} right={0}>
          <div
            style={{
              position: "relative",
              width: "fit-content", // To ensure the div wraps around the avatar
            }}
            className="profMain"
          >
            <Avatar
              src={imageSrc || user?.image}
              size={"2xl"}
              onClick={handleAvatarClick} // Avatar click handler
              cursor="pointer" // Show pointer cursor to indicate it's clickable

            />

            <Box
              height={"128px"}
              width={"128px"}
              borderRadius={"50%"}
              position={"absolute"}
              top={"0"}
              background={"rgba(0, 0, 0, 0.5)"} // Set background with opacity
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
              pointerEvents="none" // Prevent interaction when hidden
              transition="opacity 0.3s ease, transform 0.3s ease" // Smooth animation
              transform="scale(0.9)" // Start smaller for animation effect
              style={{
                pointerEvents: "none",
              }}
              className="hoverBox"
            >
              <h5
                style={{
                  letterSpacing: "1px",
                  fontWeight: "500",
                  fontSize: "20px",
                  color: "white",
                }}
              >
                Edit
              </h5>
            </Box>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef} // Connect the input with the ref
              style={{ display: "none" }} // Hide the input field
              onChange={handleImageChange}
            />
          </div>

          <Box className="flexBox" flexDir={"column"} color={"white"}>
            <h1 style={{ fontSize: "20px", letterSpacing: "1px" }}>
              {user?.name?.charAt(0).toUpperCase() +
                user?.name?.slice(1).toLowerCase()}
            </h1>
            <h1 style={{ color: "rgb(223, 214, 214)", letterSpacing: "1px" }}>
              {user?.email}
            </h1>
            {user?.role === "user" && (
              <>
                <ul className="profUl">
                  <li className="profLi">
                    <NavLink
                      to="my-info"
                      className={({ isActive }) =>
                        isActive ? "active-link profLi" : "profLi"
                      }
                      onClick={changeShow}
                    >
                      {" "}
                      <i className="bi bi-info-circle-fill profIcon"></i> Your
                      Info
                    </NavLink>
                  </li>

                  <li className="profLi">
                    <NavLink
                      to="your-reviews"
                      className={({ isActive }) =>
                        isActive ? "active-link profLi" : "profLi"
                      }
                      onClick={changeShow}
                    >
                      <i className="bi bi-star-fill profIcon"></i> Reviews
                    </NavLink>
                  </li>
                  <li className="profLi">
                    <NavLink
                      to="your-appoinment"
                      className={({ isActive }) =>
                        isActive ? "active-link profLi" : "profLi"
                      }
                      onClick={changeShow}
                    >
                      <i className="fas fa-user-md profIcon"></i> Appointed
                      Doctors
                    </NavLink>
                  </li>
                  {user?.status && (
                    <li className="profLi">
                      {user?.status === "In process" && (
                        <i className="bi bi-hourglass-split profIcon"></i>
                      )}
                      Your request in queue
                    </li>
                  )}
                </ul>
                {!user?.status && (
                  <button
                    className="defaultBtn profBtn"
                    onClick={handleApplication}
                    style={{
                      background: "#78be10",
                      border: "none",
                      color: "white",
                      marginTop: "25px",
                    }}
                  >
                    Become a doctor
                  </button>
                )}
              </>
            )}
            {user?.role === "admin" && (
              <>
                <ul className="profUl">
                  <li className="profLi">
                    <NavLink
                      to="my-info"
                      className={({ isActive }) =>
                        isActive ? "active-link profLi" : "profLi"
                      }
                      onClick={changeShow}
                    >
                      <i className="bi bi-info-circle-fill profIcon"></i> Your
                      Info
                    </NavLink>
                  </li>

                  <li className="profLi">
                    <NavLink
                      to="approvals"
                      className={({ isActive }) =>
                        isActive ? "active-link profLi" : "profLi"
                      }
                      onClick={changeShow}
                    >
                      <i className="bi bi-person-plus-fill profIcon"></i>{" "}
                      Pending Approvals
                    </NavLink>
                  </li>

                  <li className="profLi">
                    <i className="bi bi-exclamation-circle-fill profIcon"></i>{" "}
                    User Reports
                  </li>

                  <li className="profLi">
                    <i className="fas fa-user-md profIcon"></i> All Doctors
                  </li>
                </ul>
              </>
            )}

            {user?.role === "doctor" && (
              <>
                <ul className="profUl">
                  <li className="profLi">
                    <NavLink
                      to="my-info"
                      className={({ isActive }) =>
                        isActive ? "active-link profLi" : "profLi"
                      }
                      onClick={changeShow}
                    >
                      <i className="bi bi-info-circle-fill profIcon"></i> Your
                      Info
                    </NavLink>
                  </li>

                  <li className="profLi">
                    <NavLink
                      to="appoinments"
                      className={({ isActive }) =>
                        isActive ? "active-link profLi" : "profLi"
                      }
                      onClick={changeShow}
                    >
                      <i className="bi bi-person-plus-fill profIcon"></i>{" "}
                      Pending Appoinments
                    </NavLink>
                  </li>

                  <li className="profLi">
                    <NavLink
                      to="your-reviews"
                      className={({ isActive }) =>
                        isActive ? "active-link profLi" : "profLi"
                      }
                      onClick={changeShow}
                    >
                      <i class="bi bi-star-fill"></i> My Reviews
                    </NavLink>
                  </li>

                  <li className="profLi">
                    <NavLink
                      to="earning"
                      className={({ isActive }) =>
                        isActive ? "active-link profLi" : "profLi"
                      }
                      onClick={changeShow}
                    >
                      <i className="fas fa-user-md profIcon"></i> Earning
                    </NavLink>
                  </li>
                </ul>
              </>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default ProfSideBar;
