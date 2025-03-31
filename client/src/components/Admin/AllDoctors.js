import React, { useCallback, useEffect, useState } from 'react'
import { Box } from '@chakra-ui/react'
import axios from 'axios';
import { useAuthState } from '../../context/AuthProvider';
import DoctorCard from './allDoctorsComponent/DoctorCard';
const Doctors = () => {
  const [doctors,setDoctors]=useState([]);
  const {user}=useAuthState();

  let token = user?.jwt;
  const [loading, setLoading] = useState(false);

  const fetchDoctors = useCallback(async () => {
    if (!token) return;
    setLoading(true);
       const { data } = await axios.get(
         `${process.env.REACT_APP_API_URL}/api/v1/user`,
         {
           headers: {
             "Content-Type": "application/json",
             authorization: `Bearer ${token}`,
           },
         }
       );
    if (data.success) {
      setDoctors(data?.doctors);
    }
    setLoading(false);
  }, [ token]);
  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  return (
    <Box
    display={"flex"}
    flexDir={"column"}
    alignItems={"start"}
    justifyContent={"start"}
    w={"clamp(320px,90%,1000px)"}
    minH={"85vh"}
    maxH={"85vh"}
    gap={"30px"}
overflowY={"auto"}
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
        maxHeight:"63vh"
      },
    }}
    >
      {doctors.length > 0 && (
        <h1 className="page-head" style={{ marginBottom: "5px" }}>
          All Doctors
        </h1>
      )}
      {!loading ? (
        doctors.length > 0 ? (
          doctors.map((doctor) => (
            <DoctorCard
              doctor={doctor}
              setDoctors={setDoctors}
            />
          ))
        ) : (
          <h1 className="no-item-text">No Doctors</h1>
        )
      ) : (
        <h1 className="no-item-text">Loading...</h1>
      )}
    </Box>
  )
}

export default Doctors
