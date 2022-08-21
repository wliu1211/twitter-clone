import React, {useState, useEffect, useContext} from 'react';
import './RegisterForm.css'
import Modal from '../Modal/Modal'
import {useNavigate} from 'react-router-dom';

import {AuthContext} from '../../App';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import TextField from '@mui/material/TextField';
 
 
 
function RegisterForm({openRegister, closeRegister}) {
  const navigate = useNavigate();
  const {authService} = useContext(AuthContext);
 const [birthdate, setBirthdate] = useState(new Date());
 const [name, setName] = useState('');
 const [password, setPassword] = useState('');
 const [email, setEmail] = useState('');
 const [picture, setPicture] = useState('default.png');
 const [twitterHandle, setTwitterHandle] = useState('');
 const [phone, setPhone] = useState('');

 const INIT_ERROR = {
    "twitterHandle": '',
    "password": '',
 }

 const [error, setError] = useState(false);
 const [errorText, setErrorText] = useState(INIT_ERROR);
 
 const color = "#ffff";

 const createAccount = (e) => {
   e.preventDefault();
   if(name.length && email.length && twitterHandle.length){
     const userInfo = {
       name,
       email,
       password,
       picture,
       twitterHandle,
       phone,
       birthdate,
     }
     const newInfo = {
      "email": email,
      "password": password
     }
     if (password.length < 8) {
      setErrorText({...errorText, password: 'Password must be at least 8 characters long.'});
       return 0;
     }
     authService.findUserByTwitterHandle(twitterHandle).then(() => {
       setErrorText({...errorText, twitterHandle: 'This username has been taken.'})
       
      }).catch((err) => {
        setErrorText({...errorText, twitterHandle: ''})
        authService.registerAccount(newInfo).then(() => {
          authService.addUser(userInfo).then(() => {
              authService.loginUser(email, password).then(() => {
                navigate("/");
              setErrorText(INIT_ERROR);
            }).catch(err => {
              console.error("error in logging in user", err);
              setError(true);
            })
          }).catch(err => {
            console.error("error in adding user", err);
            setError(true);
          })
        }).catch(err => {
          console.error("error in registering account", err);
          setError(true);
        })
      })
        
      }

   // log in
 
 }
 const handleDateChange = (newValue) => {
   setBirthdate(newValue);
   console.log(newValue);
 }
 return (
   <Modal title={<i style={{color: 'white'}} className="fab fa-twitter"></i>} isOpen={openRegister} close={closeRegister}>
       <div className="register-container">
           <form onSubmit={createAccount} className="register-body-container">
               <h2>Create your account</h2>
               <input className="register-input" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name"/>
               <input className="register-input" type="text" value={twitterHandle} onChange={({target: {value}}) => setTwitterHandle(value)} placeholder="Username"/>
               {errorText.twitterHandle.length ? <p className="error-text">{errorText.twitterHandle}</p> : <p></p>}
               <input className="register-input" type="password" value={password} onChange={({target: {value}}) => setPassword(value)} placeholder="Password"/>
               {errorText.password.length ? <p className="error-text">{errorText.password}</p> : <p></p>}
               <input className="register-input" type="email" value={email} onChange={({target: {value}}) => setEmail(value)} placeholder="Email"/>
               <input className="register-input" type="text" value={phone} onChange={({target: {value}}) => setPhone(value)} placeholder="Phone Number (optional)"/>
               <h3 className="register-dob-header">Date of Birth</h3>
               <p className="register-dob-text">This will not be shown publicly. Confirm your own age, even if this account is for a business, a pet, or something else.</p>
                 
               <LocalizationProvider dateAdapter={AdapterDateFns}>
               <DesktopDatePicker
                 label="Birthdate"
                 value={birthdate}
                 onChange={handleDateChange}
                 className="birthday-picker"
                 renderInput={(params) => <TextField sx={{
                  svg: { color },
                  input: { color },
                  label: { color },
                  
                }} {...params} />}
               />
               </LocalizationProvider>
               <input className="register-submit" type="submit" value="Create Account" />
           </form>
       </div>
   </Modal>
 )
}
 
export default RegisterForm
