import React, {useState, useEffect, useContext} from 'react';
import { Button } from '@mui/material'
import {useNavigate} from 'react-router-dom';
import './LoginForm.css';
import {AuthContext} from '../../App'
import Modal from '../Modal/Modal'
import { TextField } from '@material-ui/core';
 
function LoginForm({openLogin, closeLogin, registerClicked}) {
   const {authService} = useContext(AuthContext);
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [error, setError] = useState(false);
   const [errorText, setErrorText] = useState('');
   const navigate = useNavigate();
 
   useEffect(() => {
    setErrorText('');
   }, [openLogin])
   
   const loginUser = (e) => {
       e.preventDefault();
       authService.loginUser(email, password).then((res) => {
           if (authService.isLoggedIn){
               navigate("/");
               setError(false);
               setErrorText('');
           } else {
            setErrorText("Incorrect email or password.");
           }
       }).catch((err) => {
           console.error("error in logging in", err);
           setError(true);
       });
   }
 return (
   <Modal title={<i style={{color: 'white'}} className="fab fa-twitter"></i>} isOpen={openLogin} close={closeLogin}>
       <div className="login-container">
           <form className="login-body-container" onSubmit={loginUser}>
               <h2>Sign in to Twitter</h2>
               <button className="register-google-btn">
                   <i class="fab fa-google"></i>
                   <p>Sign in with Google</p>
               </button>
               <button className="register-apple-btn">
                   <i class="fab fa-apple"></i>
                   <p>Sign in with Apple</p>
               </button>
               <p className="signin-or">or</p>
               <input className="signin-input" type="text" placeholder='Email' onChange={({target: {value}})=>setEmail(value)}/>
               <input className="signin-input" type="password" placeholder='Password' onChange={({target: {value}})=>setPassword(value)}/>
               {errorText.length ? <p style={{marginBottom: '20px'}} className="error-text">{errorText}</p> : <p></p>}
               {error ? <p style={{marginBottom: '20px'}} className="error-text">Login failed.</p> : <p></p>}
               <input className="login-btn" type="submit" value="Login"/>
               <button className="forgot-btn">Forgot password?</button>
               <p>Don't have an account? <span className="register-text" onClick={registerClicked}>Sign up</span></p>
           </form>
       </div>
   </Modal>
 )
}
 
export default LoginForm
