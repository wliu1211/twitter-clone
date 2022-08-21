import React, {useState, useEffect, useContext} from 'react';
import "./Messages.css";
import { faInbox, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import UserIdentity from '../UserIdentity/UserIdentity';
import {AuthContext} from '../../App';
import { Button } from '@material-ui/core';
import {MessageContext} from '../TwitterHome/TwitterHome'

import ComposeDm from './ComposeDm';
import TargetUserDm from './TargetUserDm';

function Messages() {
  const {authService} = useContext(AuthContext);
  const {messageService} = useContext(MessageContext);
  const [searchInput, setSearchInput] = useState('');
  const [searchError, setSearchError] = useState(false);
  const [dmList, setDmList] = useState([]);
  const [originalDmList, setOriginalDmList] = useState([])
  const [targetUser, setTargetUser] = useState({});
  const [dmText, setDmText] = useState("");
  const [openDmComposition, setOpenDmComposition] = useState(false);
  useEffect(() => {
    messageService.getMessages().then((res) => {
      const {success, data} = res.data;
      if (success) {
        const filteredDmsList = data.filter(dm => dm.fromUserId === authService.id || dm.toUserId === authService.id);
        const revList = filteredDmsList.reverse();
        setDmList([...revList]);
        setOriginalDmList([...revList]);
        setTargetUser(revList[0]);
        
      }
    }).catch((error) => {
      console.error(error);
      setSearchError(true);
    })
  }, [openDmComposition])
    
  const deleteDmToUser = (dmUserId) => {
    messageService.deleteMessage(dmUserId);
    const filteredList = dmList.filter((dmUser) => dmUser._id !== dmUserId);
    setDmList([...filteredList]);
  }
  const targetUserDm = (targetedUser) => {
    setTargetUser(targetedUser)
  }

  const searchDmList = ({target: {value}}) => {
    setSearchInput(value);
    onkeyup =() => {
      if(!value){
        setDmList([...originalDmList]);
        } else {
          let filteredList = dmList.filter(dm => dm.toName.trim().toLowerCase().includes(value.trim().toLowerCase()) || dm.toTwitterHandle.trim().toLowerCase().includes(value.trim().toLowerCase()));
          setDmList(filteredList);
        }
      }
    }
    
  const sortFromAndToDms = (users) => {
    if(users.toUserId === authService.id){
      const user = {
        "_id":users._id,
        "name": users.fromName,
        "twitterHandle": users.fromTwitterHandle,
        "picture": users.fromPicture,
      }
      return (
        <UserIdentity user={user} activeHoverClass="user-containers active-hover"/>
      )
    } else if(users.fromUserId === authService.id){
      const user = {
        "_id": users._id,
        "name": users.toName,
        "twitterHandle": users.toTwitterHandle,
        "picture": users.toPicture,
      }
      return (
        <UserIdentity user={user} activeHoverClass="user-containers active-hover"/>
      )
    }
  }
  
  return (
    <div className="message-section">
        <div className="message-left-container">
          <div className="message-left-header">
            <h3>Messages</h3>
            <FontAwesomeIcon className="compose-message-icon" icon={faInbox} onClick={() => setOpenDmComposition(true)}/>
          </div> 
          <div className="message-left-body">
            <div className='dm-search-container'>
              <FontAwesomeIcon className="dm-search-icon" icon={faMagnifyingGlass} />
              <input type="text" className="dm-search-input" onChange={searchDmList} value={searchInput}/>
            </div>
            <div className='dm-results-container'>
              {dmList.length ? dmList.map((user) => (
                <div className={user._id === targetUser._id ? "dm-user-container selected" : "dm-user-container"} key={user._id} onClick={() => targetUserDm(user)}>
                  {sortFromAndToDms(user)}
                  <p className="delete-dm-btn" onClick={() => deleteDmToUser(user._id)}>&times;</p>
                </div>
              )) : <div style={{margin: '30px'}}>No composed direct messages</div>}
            </div>
          </div>
        </div>
        {dmList.length ? <TargetUserDm selectedUser={targetUser} text={dmText} setText={setDmText}/> : <div style={{margin: '30px'}}>No User Selected</div>}
        <ComposeDm openDm={openDmComposition} closeDm={setOpenDmComposition} setUser={setTargetUser}/>
    </div>
);
}

export default Messages;
