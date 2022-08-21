import React, {useState, useEffect, useContext} from 'react';
import "./Broadcast.css";
import {
   Routes,
   Route,
   useNavigate
 } from "react-router-dom";
import HomeScreen from '../HomeScreen/HomeScreen';
import Notifications from '../Notifications/Notifications';
import Messages from '../Messages/Messages';
import Profile from '../Profile/Profile';
 import {AuthContext} from '../../App'
 
function Broadcast() {  
  const navigate = useNavigate();
  const {authService, user, setUser} = useContext(AuthContext);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    let timer1 = setTimeout(() => {
      const INIT_USER = {
        "name": authService.name,
        "twitterHandle": authService.twitterHandle,
        "picture": authService.picture,
        "phone": authService.phone,
        "id": authService.id
      }
      setUser(INIT_USER);
      setLoaded(true);
    },1000);
    navigate("/home");
    return () => {
    clearTimeout(timer1);
  }
  }, [])
 return(
   <div className="feed-container">
      {loaded ? <Routes>
         <Route path="home" element={<HomeScreen userInformation={user}/>} />
         <Route path="notifications" element={<Notifications />} />
         <Route path="messages" element={<Messages />} />
         <Route path="profile" element={<Profile />} />
       </Routes> : <div style={{margin: '30px'}}>Loading...</div>}
   </div>
 )
}
 
export default Broadcast;
