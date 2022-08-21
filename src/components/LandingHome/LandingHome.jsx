import React, {useState, useEffect} from 'react';
import './LandingHome.css';
import LoginForm from '../LoginForm/LoginForm';
import RegisterForm from '../RegisterForm/RegisterForm';
 
 
function LandingHome() {
   const [openSignin, setOpenSignin] = useState(false);
   const [openRegister, setOpenRegister] = useState(false);
 
   const handleOpenSignin = () => {
       setOpenSignin(!openSignin);
   }
  
   const registerClicked = () => {
       setOpenSignin(false);
       setOpenRegister(!openRegister)
   }
   return (
       <div>
           <div className="app-container">
               <div className="twitter-container">
                   <div className="twitter-img-wrapper">
                       <img src="./twitter-home-img.png" alt="twitter-home-img" />
                   </div>
                   <div className="get-started-container">
                       <i className="fab fa-twitter"></i>
                       <h1>Happening now</h1>
                       <h3 className="join-twitter-text">Join Twitter Today</h3>
                       <button className="register-google-btn">
                           <img src="https://img.icons8.com/color/48/000000/google-logo.png"/>
                           <p>Sign up with Google</p>
                       </button>
                       <button className="register-apple-btn">
                           <img src="https://img.icons8.com/ios-filled/50/000000/mac-os.png"/>
                           <p>Sign up with Apple</p>
                       </button>
                       <div className="or-break-container">
                           <p className="or-break">or</p>
 
                       </div>
                       <button className="register-user-btn">
                           <p>Sign up with phone or email</p>
                       </button>
                       <p className="TOS-text">By signing up, you agree to the <span>Terms of Service</span> and <span>Privacy <br /> Policy</span>, including <span>Cookie Use</span></p>
                       <h3 className="have-account-text">Already have an account?</h3>
                       <button className="sign-in-btn" onClick={handleOpenSignin}>
                           <p>Sign in</p>
                       </button>
                   </div>
               </div>
               <footer>
                   <div className="app-footer">
                       <p>About</p>
                       <p>Help Center</p>
                       <p>Terms of Service</p>
                       <p>Privacy Policy</p>
                       <p>Cookie Policy</p>
                       <p>Accessibility</p>
                       <p>Ads Info</p>
                       <p>Blog</p>
                       <p>Status</p>
                       <p>Careers</p>
                       <p>Brand Resources</p>
                       <p>Advertising</p>
                       <p>Marketing</p>
                       <p>Twitter for Business</p>
                       <p>Developers</p>
                       <p>Director</p>
                       <p>Settings</p>
                       <p>C 2022 Twitter, Inc.</p>
                   </div>
               </footer>
           </div>
           <LoginForm openLogin={openSignin} closeLogin={setOpenSignin} registerClicked={registerClicked}/>
           <RegisterForm openRegister={openRegister} closeRegister={setOpenRegister}/>
       </div>
   );
}
 
export default LandingHome;
 
