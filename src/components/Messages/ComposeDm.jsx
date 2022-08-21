import React, {useState, useEffect, useContext} from 'react'
import Modal from '../Modal/Modal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import {AuthContext} from '../../App';
import {MessageContext} from '../TwitterHome/TwitterHome'
import UserIdentity from '../UserIdentity/UserIdentity';

function ComposeDm({openDm, closeDm, setUser}) {
  const {authService} = useContext(AuthContext);
  const {messageService} = useContext(MessageContext);
  const [usersList, setUsersList] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  

  useEffect(() => {
    authService.getUsers().then((res) => {
      const {success, data} = res.data;
      if (success) {
        setUsersList([...data]);
        setAllUsers([...data]);
      }
    }).catch((error) => {
      console.error(error);
    })
  }, [])
  const selectedUserDm = (user) => {
    messageService.addMessage(user, authService);
    setUser(user);
    closeDm(false);
  }
  const searchComposeDmList = ({target: {value}}) => {
    setSearchInput(value);
    onkeyup =() => {
        if(!searchInput.length){
          setUsersList(allUsers);
        }
        let filteredList = allUsers.filter(user => user.twitterHandle.trim().toLowerCase().includes(value.trim().toLowerCase()) || user.name.trim().toLowerCase().includes(value.trim().toLowerCase()));
        setUsersList(filteredList);
    }
    }
    
  return (
    <Modal title="New Message" isOpen={openDm} close={closeDm}>
        <div className='new-dm-search-container'>
            <FontAwesomeIcon className="new-dm-search-icon" icon={faMagnifyingGlass} />
            <input type="text" className="new-dm-search-input" onChange={searchComposeDmList} value={searchInput}/>
        </div>
        <div className="new-dm-list-container">
          {usersList.map((user) =>(
            <div key={user._id} onClick={() => selectedUserDm(user)}>
              <UserIdentity user={user} activeHoverClass="user-containers active-hover"/>

            </div>

          ))}
        </div>
    </Modal>
  )
}

export default ComposeDm