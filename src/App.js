import react, {useState, useEffect, useContext, createContext} from 'react';
import './App.css';
import {AuthService} from './services';
import {
 BrowserRouter as Router,
 Routes,
 Route,
 Outlet,
 Navigate
} from 'react-router-dom';
import LandingHome from './components/LandingHome/LandingHome';
import TwitterHome from './components/TwitterHome/TwitterHome';
 
const authService = new AuthService();
export const AuthContext = createContext();
 
const AuthProvider = ({children}) => {
 const context = {
   authService,
   user: {
    "name": authService.name,
    "twitterHandle": authService.twitterHandle,
    "email": authService.email,
    "picture": authService.picture,
    "id": authService.id
   },
   setUser: (targetUser) => {
    setAuthContext({...authContext, user: targetUser});
   },
 }
 
 const [authContext, setAuthContext] = useState(context);
 return(
   <AuthContext.Provider value={authContext}>
     {children}
   </AuthContext.Provider>
 )
 
}
 
const PrivateRoute = (props) => {
 const context = useContext(AuthContext);
 return context.authService.isLoggedIn ? <Outlet/> : <Navigate to="/login"/>;
}
 
function App() {
 
 return (
   <div className="App">
     <AuthProvider>
         <Routes>
           <Route path="/login" element={<LandingHome />} />
           <Route path="/*" element={<PrivateRoute/>}>
             <Route path="/*/*" element={<TwitterHome/>} />
           </Route>
         </Routes>
     </AuthProvider>
   </div>
 );
}
 
export default App;
 
