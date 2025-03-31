import React, { useCallback, useEffect, useState } from 'react'
import { Box } from '@chakra-ui/react'
import ReportCard from './reportComponent/ReportCard';
import axios from 'axios';
import { useAuthState } from '../../context/AuthProvider';
const Reports = () => {
  const [reports,setReports]=useState([]);
  const {user}=useAuthState();

  let token = user?.jwt;
  const [loading, setLoading] = useState(false);

  const fetchReports = useCallback(async () => {
    if (!token) return;
    setLoading(true);
       const { data } = await axios.get(
         `${process.env.REACT_APP_API_URL}/api/v1/report`,
         {
           headers: {
             "Content-Type": "application/json",
             authorization: `Bearer ${token}`,
           },
         }
       );
    if (data.success) {
      setReports(data?.reports);
    }
    setLoading(false);
  }, [ token]);
  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

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
      {reports.length > 0 && (
        <h1 className="page-head" style={{ marginBottom: "5px",textDecoration:"underline" }}>
          Doctor's reports
        </h1>
      )}
      {!loading ? (
        reports.length > 0 ? (
          reports.map((report) => (
            <ReportCard
              report={report}
              setReports={setReports}
              reports={reports}
            />
          ))
        ) : (
          <h1 className="no-item-text">No reports</h1>
        )
      ) : (
        <h1 className="no-item-text">Loading...</h1>
      )}
    </Box>
  )
}

export default Reports
