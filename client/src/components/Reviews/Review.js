import React,{useState} from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { Box } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthState } from "../../context/AuthProvider";
import axios from "axios";

const Review = () => {
  const { state } = useLocation(); // Get the location object which contains the state
  const [rating,setRating]=useState(0);
  const [text,setText]=useState("");
  const {user}=useAuthState();
  const doctor = state?.user; // Access the user data from the state
  const navigate=useNavigate();
  const handleApplication=()=>{
    navigate('/doctor/form');
  }
  // submit feedback to backend
  const handleFeedback=async()=>{
    const token = user?.jwt;
    const url=`${process.env.REACT_APP_API_URL}/api/v1/review/${doctor?._id}`;
    const {data} = await axios.post(
      url,
      {text,rating},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if(data.success){
      alert("Review submitted");
      navigate('/');
    }else{
      alert(data.message)
    }
  }
  return (
    <>
      <Navbar />
      <Box
        w={"100vw"}
        minH={"62vh"}
        p={"50px"}
        pb={"0"}
        mt={'45px'}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"start"}
        gap={"15%"}
      >
        <Box
          w={{md:"50%",base:"clamp(250px,100vw,1000px)"
}}
          border={"1px solid gray"}
          borderRadius={"10px"}
          pb={"10px"}
        >
          <Box
            bg={"#f1f1f1"}
            borderRadius={"10px 10px 0 0"}
            paddingLeft={"5px"}
            mb={"10px"}
            pb={"5px"}
          >
            <h3
              style={{
                fontSize: "clamp(15px,4vw,20px)",
                fontWeight: "400",
                letterSpacing: "1px",
              }}
            >
              Submit Feedback for Dr. {doctor?.name}
            </h3>
          </Box>
          <Box pl={"5px"} pb={"4px"} pr={"2px"}>
            <p style={{ marginBottom: "10px" }}>
              How would you rate your overall experience at the clinic.
            </p>
            <Box display={"flex"} gap={"8px"} mb={"20px"}>
              {[1, 2, 3, 4, 5].map((ele) => (
                <i
                  className={ele<=rating?"bi bi-star-fill":"bi bi-star"}
                  style={{ fontSize: "30px", cursor: "pointer",color:ele<=rating&&"#ffd700" }}
                  onClick={(e) => {
                    if(rating>0&&ele<=rating){
                      setRating(ele-1);
                      return;
                    }
                    if(rating<=5)
                    setRating(ele);
                 
                  }}
                ></i>
              ))}
            </Box>
            <p style={{ marginBottom: "10px" }}>
              Tell us about you experience with Dr. Shubhada Sanjiv Khandeparkar
            </p>
            <textarea
              style={{
                border: "1px solid gray",
                outline: "none",
                padding: "5px",
                fontSize: "15px",
                width:"clamp(180px,95%,1000px)"
              }}
              value={text}
              onChange={(e)=>setText(e.target.value)}
            />
            <button
              className="homePageBtn"
              style={{
                borderRadius: "10px",
                display: "block",
                marginTop: "20px",
                width: "98%",
              }}
              onClick={handleFeedback}
            >
              Submit Feedback
            </button>
          </Box>
        </Box>
        <Box w={"clamp(300px,30%,1000px)"} display={{base:"none",md:"grid"}}>
          <img
            src="https://assets.lybrate.com/f_auto,c_limit,w_640,q_auto/imgs/tic/icon/Are-you-a-doctor_Banner_web%201.png"
            alt=""
            style={{ width: "100%" }}
          />
          <button
            className="homePageBtn"
            style={{ marginTop: "0", borderRadius: "10px", width: "100%" }}
            onClick={handleApplication}
          >
            Become a doctor
          </button>
        </Box>
      </Box>
      <Footer />
    </>
  );
};

export default Review;
