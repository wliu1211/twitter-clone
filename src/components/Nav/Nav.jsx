import React, {useState, useEffect, useContext} from 'react';
import TwitterIcon from '@mui/icons-material/Twitter';
import {
    Link,
  } from "react-router-dom";
import './Nav.css'
import HomeIcon from '@mui/icons-material/Home';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import {AuthContext} from '../../App'
import {UserSearchContext, NavContext} from '../TwitterHome/TwitterHome'

import { grey } from '@mui/material/colors';

const textColor = grey[300];

function Nav() {
    const {authService} = useContext(AuthContext);
    const {setSelectedUser} = useContext(UserSearchContext);
    const {selectedNav, setSelectedNav} = useContext(NavContext);
    const profileClicked = () => {
        const INIT_USER = {
            "name": authService.name,
            "id": authService.id,
            "twitterHandle": authService.twitterHandle,
            "email": authService.email,
            "phone": authService.phone,
            "picture": authService.picture,
            "birthDate": authService.birthDate,
            "joinedDate": authService.joinedDate,
        }
        setSelectedUser(INIT_USER);
    }
    
  return (
    <nav className="main-nav">
        <TwitterIcon style={{margin: '10px'}} fontSize='large'/>
        <div className="nav-container">
            <Link className="nav-link" to="/home">
                <div onClick={() => setSelectedNav('home')} className={selectedNav === 'home' ? 'nav-item active' : 'nav-item'}>
                    <HomeIcon fontSize="large" sx={{color: textColor}} />
                    <p>Home</p>
                </div>
            </Link>
            <Link className="nav-link" to="/notifications">
                <div onClick={() => setSelectedNav('noti')} className={selectedNav === 'noti' ? 'nav-item active' : 'nav-item'}>
                    <NotificationsNoneIcon fontSize="large"  sx={{color: textColor}}/>
                    <p>Notification</p>
                </div>
            </Link>
            <Link className="nav-link" to="/messages">
                <div onClick={() => setSelectedNav('message')} className={selectedNav === 'message' ? 'nav-item active' : 'nav-item'}>
                    <MailOutlineIcon fontSize="large" sx={{color: textColor}} />
                    <p>Messages</p>
                </div>
            </Link>
            <Link className="nav-link" to="/profile" onClick={profileClicked}>
                <div onClick={() => setSelectedNav('profile')} className={selectedNav === 'profile' ? 'nav-item active' : 'nav-item'}>
                    <PersonOutlineIcon fontSize="large" sx={{color: textColor}} />
                    <p>Profile</p>
                </div>

            </Link>

        </div>
    </nav>
    );
}

export default Nav;
