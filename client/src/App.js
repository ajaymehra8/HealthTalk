import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import UserInfo from "./components/User/UserProfile";
import { useAuthState } from "./context/AuthProvider";
import DocProf from "./components/Doctors/DocProf";
import Review from "./components/Reviews/Review";
import BecomeDoctorForm from "./components/Doctors/BecomeDoctorForm";
import { GoogleOAuthProvider } from "@react-oauth/google";

function App() {
  const { user } = useAuthState();
const GoogleAuthWrapper=()=>{
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_OAUTH_CLIENT_ID}>
      <Login/>
    </GoogleOAuthProvider>
  )
}
const GoogleAuthWrapperForSignUp=()=>{
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_OAUTH_CLIENT_ID}>
      <Signup/>
    </GoogleOAuthProvider>
  )
}
  return (
    <Routes>
      <Route
        path="/*"
        element={
          user ? user.role === "user" ? <Home /> : <UserInfo /> : <Home />
        }
      />

      <Route path="/login" element={<GoogleAuthWrapper />} />
      <Route path="/signup" element={<GoogleAuthWrapperForSignUp/>} />
      <Route path="/my-profile/*" element={<UserInfo />} />
      <Route path="/doctor-profile" element={(user?.role==="user" || user?.role==="admin" || !user)&&<DocProf />} />
      <Route path="/doctor/review" element={<Review />} />
      <Route path="/doctor/form" element={user?.role==="user"&&<BecomeDoctorForm />} />
    </Routes>
  );
}

export default App;
