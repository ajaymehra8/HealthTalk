import axios from 'axios';

export const signup=async(info)=>{
const {data}=await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/user/signup`,info);
return data;
};

export const login=async(info)=>{
    const {data}=await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/user/login`,info);
    return data;
};