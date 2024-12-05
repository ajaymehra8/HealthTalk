import './App.css';
import {Routes,Route} from 'react-router-dom'
import Home from './pages/Home';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import UserInfo from './components/User/UserProfile';
import { useAuthState } from './context/AuthProvider';
import DocProf from './components/Doctors/DocProf';
import Review from './components/Reviews/Review';
import BecomeDoctorForm from './components/Doctors/BecomeDoctorForm';

function App() {
  const {user}=useAuthState();
  return (

    <Routes>
      <Route path='/' element={user?<Home/>:<Login/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/signup' element={<Signup/>}/>
      <Route path='/my-profile/*' element={<UserInfo/>}/>
      <Route path='/doctor-profile' element={<DocProf/>}/>
      <Route path='/doctor/review' element={<Review/>}/>
      <Route path='/doctor/form' element={<BecomeDoctorForm/>}/>


    </Routes>
  );
}

export default App;
