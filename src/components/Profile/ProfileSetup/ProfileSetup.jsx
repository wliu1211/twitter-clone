import React, {useState, useEffect, useContext} from 'react'
import "./ProfileSetup.css"
import {AuthContext} from '../../../App'
import Modal from '../../Modal/Modal'
import {useNavigate} from 'react-router-dom';

const moment = require('moment');

function ProfileSetup({title, openProfileSetup, closeProfileSetup}) {
  const navigate = useNavigate();
  const {authService, setUser} = useContext(AuthContext);
  const [editClicked, setEditClicked] = useState(false);
  const bufferUserInfo = {
    "name": authService.name,
    "twitterHandle": authService.twitterHandle,
    "picture": authService.picture,
    "phone": authService.phone,
    "id": authService.id,
  }
  const errorText = {
    "twitterHandle": '',
    "phone": '',
  }
  const [userInfo, setUserInfo] = useState(bufferUserInfo);
  const [password, setPassword] = useState('*****');
  const [targetEditBtn, setTargetEditBtn] = useState('');
  const [error, setError] = useState(errorText);
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState(authService.picture);
  useEffect(() => {
    if(!selectedFile){
      setPreview(authService.picture);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
    setUserInfo({...userInfo, picture: objectUrl})
    return () => URL.revokeObjectURL(objectUrl);
 
 
  }, [selectedFile]);
 const onSelectFile = (e) => {
   if (!e.target.files || e.target.files.length === 0){
     setSelectedFile(undefined);
     return;
   }

   setSelectedFile(e.target.files[0]);
 }

  useEffect(() => {
    setEditClicked(false);
    setPassword('*****');
    setUserInfo(bufferUserInfo);
    setError(errorText);
  }, [openProfileSetup])
  
  
  const editProfileClicked = () => {
    setEditClicked(!editClicked);
    setTargetEditBtn('');
  }
  const saveProfileClicked = () => {
    setEditClicked(!editClicked);
    // check for validations
    authService.getUsers().then((users) => {
      if (!users.data.data.some(user => user.twitterHandle.toLowerCase() === userInfo.twitterHandle.toLowerCase())) {
        authService.editUser(authService.id, userInfo);
        authService.setPrimaryUserData(userInfo);
        setUser(userInfo);
        setError(errorText);
      }else {
        setError({...error, twitterHandle: 'Username has been taken.'})
      }
      if(password !== '*****'){
        authService.changePassword(authService.accountId, password);
      }
    })
  }

  const editName = () => ({target}) => {setUserInfo({...userInfo, name: target.value});}
  const editUsername = () => ({target}) => {setUserInfo({...userInfo, twitterHandle: target.value});}
  const editPhone = () => ({target}) => {setUserInfo({...userInfo, phone: target.value});}
  
  const logoutUser = () => {
      authService.logoutUser();
      navigate('/login');
  }

  const deleteAccount = () => {
    authService.deleteUser(authService.id).then(() => {
      authService.deleteAccount(authService.accountId).then(() => {
        logoutUser();
      });
    }).catch(err => {
      console.error(err);
    })
  }

  return (
    <Modal title={title} isOpen={openProfileSetup} close={closeProfileSetup}>
        <section className="profile-setup-section">
          <div className="profile-setup-top-half">
            {editClicked ? <div className="profile-setup-img-container edit-active">
              <img src={preview} alt="" />
            </div> : <div className="profile-setup-img-container">
              <img src={authService.picture} alt="" />
            </div>}
            
            
            
            {editClicked && <input type="file" id="myfile" name="myfile" onChange={onSelectFile}/>}
            { editClicked? <p className="edit-profile-btn" onClick={saveProfileClicked}>Save Profile</p> : <p className="edit-profile-btn" onClick={editProfileClicked}>Edit Profile</p>}
          </div>
          <div className="profile-setup-bottom-half">
            <div className="setup-user-wrapper">
              <div className="user-wrapper">
                <p className="user-info">Name: </p>
                {targetEditBtn === 'name' && editClicked ? <input type="text" className="edit-input" onChange={editName()}/> : <p>{userInfo.name}</p>}
              </div>
              {editClicked && <i className="fa-solid fa-pen-to-square edit-btn" onClick={() => setTargetEditBtn('name')}></i>}
            </div>
            
            <div className="setup-user-wrapper">
              <div className="user-wrapper">
                <p className="user-info">Username: </p>
                <div>
                  {targetEditBtn === 'twitterHandle' && editClicked ? <input type="text" className="edit-input" onChange={editUsername()}/> : <p>{userInfo.twitterHandle}</p>}
                  <p className="error-text">{error.twitterHandle}</p>

                </div>
              </div>
              {editClicked && <i className="fa-solid fa-pen-to-square edit-btn" onClick={() => setTargetEditBtn('twitterHandle')}></i>}
            </div>
            <div className="setup-user-wrapper">
              <div className="user-wrapper">
                <p className="user-info">Phone: </p>
                <div>
                  { targetEditBtn === 'phone' && editClicked ? <input type="text" className="edit-input" onChange={editPhone()}/> : <p>{userInfo.phone}</p>}
                  <p className="error-text">{error.phone}</p>
                </div>

              </div>
              {editClicked && <i className="fa-solid fa-pen-to-square edit-btn" onClick={() => setTargetEditBtn('phone')}></i>}
            </div>
            {editClicked && <div className="setup-user-wrapper">
              <div className="user-wrapper">
                <p className="user-info">Password: </p>
                { targetEditBtn === 'password' && editClicked ? <input type="text" className="edit-input" onChange={({target: {value}}) => setPassword(value)}/> : <p>{password}</p>}

              </div>
              {editClicked && <i className="fa-solid fa-pen-to-square edit-btn" onClick={() => setTargetEditBtn('password')}></i>}
            </div>}
            <p>Date of Birth: {moment(authService.birthDate).format('MMMM Do, YYYY')}</p>
          </div>
          <div className="profile-setup-delete-container">
            {editClicked ? <button className="profile-setup-delete-btn" onClick={deleteAccount}>Delete Account</button> : <button className="profile-setup-delete-btn" onClick={logoutUser}>Logout</button>}
          </div>
        </section>
    </Modal>
  )
}

export default ProfileSetup