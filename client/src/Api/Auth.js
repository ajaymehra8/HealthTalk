import axios from 'axios';

export const signup=async(info)=>{
const {data}=await axios.post(`http://localhost:8000/api/v1/user/signup`,info);
return data;
};

export const login=async(info)=>{
    const {data}=await axios.post(`http://localhost:8000/api/v1/user/login`,info);
    return data;
};