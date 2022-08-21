import React, {useState, useEffect, useContext} from 'react';
import "./Profile.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCakeCandles, faCalendar } from '@fortawesome/free-solid-svg-icons'
import {TweetContext} from '../TwitterHome/TwitterHome';
import {AuthContext} from '../../App'
import {UserSearchContext, FollowContext, NavContext} from '../TwitterHome/TwitterHome'
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import UserTweets from './UserTweets';
import UserLikes from './UserLikes';
import {useNavigate} from 'react-router-dom';
import FollowList from './FollowList';
import ProfileSetup from './ProfileSetup/ProfileSetup';

const moment = require('moment');

function Profile() {
  const {authService} = useContext(AuthContext);
  const {tweetService} = useContext(TweetContext);
  const {selectedUser} = useContext(UserSearchContext);
  const {followService} = useContext(FollowContext);
  const {setSelectedNav} = useContext(NavContext);
  
  const [targetAction, setTargetAction] = useState('tweets');
  const [userTweetsNumber, setUserTweetsNumber] = useState(0);
  const [followers, setFollowers] = useState([]);
  const [followings, setFollowings] = useState([]);
  const [openFollowersList, setOpenFollowersList] = useState(false);
  const [openFollowingsList, setOpenFollowingsList] = useState(false);
  const [openEditProfile, setOpenEditProfile] = useState(false);

  const navigate = useNavigate();
 const INIT_USER = {
   "name": authService.name,
   "twitterHandle": authService.twitterHandle,
   "id": authService.id,
   "email": authService.email,
   "phone": authService.phone,
   "picture": authService.picture,
   "birthDate": authService.birthDate,
   "joinedDate": authService.joinedDate,
 }
 const [userInfo, setUserInfo] = useState(INIT_USER);
 
 useEffect(() => {
  authService.findUser(userInfo.id).then((data) => {
    const {user} = data.data;
    setFollowings([...user.followings]);
    setFollowers([...user.followers]);
  }).catch(err => {
    console.error(err);
  })
  tweetService.getAllTweets().then((res) => {
    const {data, status} = res;
  if(status === 200){
    const filteredList = data.data.filter(tweet => {
      return tweet.userId === userInfo.id;
    })
    setUserTweetsNumber(filteredList.length);
  }
});
}, [userInfo]);

 useEffect(() => {
  setUserInfo(selectedUser);

}, [selectedUser])
  const backBtnClicked = () => {
    navigate("/home");
    setSelectedNav("home");

  }

  const followUser = (targetUser, authUserInfo) => {
    const info = {
      "name": authUserInfo.name,
      "twitterHandle": authUserInfo.twitterHandle,
      "picture": authUserInfo.picture,
      "userId": authUserInfo.id,
  }
    followService.addFollower(targetUser.id, authUserInfo);
    followService.addFollowing(authUserInfo.id, targetUser);
    setFollowers([...followers, info])
  }
  const unfollowUser = (targetUser, authUserInfo) => {
    const filteredList = followers.filter(followerUser => followerUser.userId !== authUserInfo.id);
    followService.removeFollower(targetUser.id, authUserInfo);
    followService.removeFollowing(authUserInfo.id, targetUser);
    setFollowers(filteredList);    
  }

  const displayTweetAction = (userInfo) => {
    switch (targetAction) {
      case 'tweets':
        return <UserTweets info={userInfo} />;
      case 'media':
        return <div style={{margin: '30px'}}>No media tweets...</div>;
      case 'likes':
        return <UserLikes info={userInfo} />;
      default:
        break;
    }
  }
  
  const displayProfileFollowBtn = (userInfo) => {
      const found = followers.some(user => user.userId === authService.id);
      if (userInfo.id === authService.id){
        return <button onClick={() => setOpenEditProfile(true)}>Set up profile</button>
      }
      if (found){
        return <button onClick={() => unfollowUser(selectedUser, INIT_USER)}>Unfollow</button>
      } else {
        return <button onClick={() => followUser(selectedUser, INIT_USER)}>Follow</button>
      }    
  }
  return (
    <section className="profile-section">
        <div>
          <div className="profile-header">
            <div className="profile-back-btn">
              <IconButton color="inherit" aria-label="back button" onClick={() => backBtnClicked()}>
                <ArrowBackIcon />
              </IconButton>
            </div>
            <div className="profile-header-info">
              <h1>{userInfo.name}</h1>
              <p>{userTweetsNumber} Tweets</p>
            </div>
          </div>
          <div className="profile-body-container">
            <div className="profile-body">
              <div className="profile-bg-grey"></div>
              <div className="profile-picture-container">
                  <img src={userInfo.picture} alt="defaultAvatar picture" />
              </div>
              <div className="profile-info-container">
                <div className="profile-setup-container">
                  {displayProfileFollowBtn(userInfo)}
                </div>
                <div className="profile-identity-container">
                  <h1>{userInfo.name}</h1>
                  <p className="profile-twitterHandle">@{userInfo.twitterHandle}</p>
                </div>
                <div className="profile-date-container">
                  <p className="profile-dob"><FontAwesomeIcon className="dob-icon" icon={faCakeCandles} /> Born {moment(userInfo.birthDate).format('LL')}</p>
                  <p className="profile-join"><FontAwesomeIcon className="calendar-icon" icon={faCalendar} />Joined {moment(userInfo.joinedDate).format('MMMM YYYY')}</p>
                </div>
                <div className="profile-follow-container">
                  <p className="profile-followings" onClick={() => setOpenFollowingsList(true)}><span>{followings.length}</span> Following</p>
                  <p className="profile-followers" onClick={() => setOpenFollowersList(true)}><span>{followers.length}</span> Followers</p>
                </div>
              </div>
            </div>
            <div className="user-private-action-switcher">
              <div className="switcher-container" onClick={() => setTargetAction('tweets')}>
                <div className="text-fitter">
                  <p>Tweets</p>
                  <div className={targetAction === 'tweets' ? 'switcher-shadow active' : 'switcher-shadow'}></div>
                </div>
              </div>
              <div className="switcher-container" onClick={() => setTargetAction('media')}>
                <div className="text-fitter">
                  <p>Media</p>
                  <div className={targetAction === 'media' ? 'switcher-shadow active' : 'switcher-shadow'}></div>
                </div>
              </div>
              <div className="switcher-container" onClick={() => setTargetAction('likes')}>
                <div className="text-fitter">
                  <p>Likes</p>
                  <div className={targetAction === 'likes' ? 'switcher-shadow active' : 'switcher-shadow'}></div>
                </div>
              </div>
            </div>
            {displayTweetAction(userInfo)}
          </div>
        </div>
        <FollowList 
          title="Followers List" 
          openFollowsList={openFollowersList} 
          closeFollowsList={setOpenFollowersList} 
          userInfo={userInfo}
          action="followers"
          />
        <FollowList 
          title="Followings List" 
          openFollowsList={openFollowingsList} 
          closeFollowsList={setOpenFollowingsList} 
          userInfo={userInfo}
          action="followings"
          />
          <ProfileSetup
            title="Profile Setup" 
            openProfileSetup={openEditProfile} 
            closeProfileSetup={setOpenEditProfile} 
            />
    </section>
    );
}

export default Profile;
