import React, {useState, useEffect, useContext} from 'react';
import './Search.css';
import {useNavigate} from 'react-router-dom';

import {AuthContext} from '../../App';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import {UserSearchContext, NavContext} from '../TwitterHome/TwitterHome'
import UserIdentity from '../UserIdentity/UserIdentity';


function Search() {
  const {authService} = useContext(AuthContext);
  const [searchInput, setSearchInput] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [searchError, setSearchError] = useState(false);
  const [searchedUsers, setSearchedUsers] = useState([]);
  const { setSelectedUser} = useContext(UserSearchContext);
  const { setSelectedNav} = useContext(NavContext);
  const navigate = useNavigate();

  const viewUser = (userId) => {
    authService.findUser(userId).then((res) => {
      const {data, status} = res;
      if(status === 200){
        const targetUser = {
          "name": data.user.name,
          "twitterHandle": data.user.twitterHandle,
          "id": data.user._id,
          "email": data.user.email,
          "phone": data.user.phone,
          "picture": data.user.picture,
          "birthDate": data.user.birthDate,
          "joinedDate": data.user.joinedDate,

        }
        setSelectedUser(targetUser);
        navigate('/profile');
        setSelectedNav('profile');
      }
    })
  }
  
  const searchFocused = () => {
    authService.getUsers().then((users) => {
      setSearchError(false);
      const {status, data} = users;
      if (status === 200) {
        setAllUsers([...data.data]);
        setSearchedUsers([...data.data]);
      }
    }).catch((error) => {
      console.error(error);
      setSearchError(true);
    })
  }
  const searchUsers = ({target: {value}}) => {
        setSearchInput(value);
        onkeyup =() => {
            if(!searchInput.length){
              setSearchedUsers(allUsers);
            }
            let filteredList = allUsers.filter(user => user.twitterHandle.trim().toLowerCase().includes(value.trim().toLowerCase()) || user.name.trim().toLowerCase().includes(value.trim().toLowerCase()));
            setSearchedUsers(filteredList);
        }
    }
  return (
    <div className="search-container">
        <form className="search-form">
          <div className='search-container'>
            <FontAwesomeIcon className="search-icon" icon={faMagnifyingGlass} />
            <input type="text" className="search-input"  value={searchInput} onChange={searchUsers} onFocus={searchFocused}/>
          </div>
        </form>
        {/* onFocus={} */}
        <div className="search-results-container">
          {searchedUsers.map((user) => (
              <div key={user._id} onClick={() => viewUser(user._id)}>
                <UserIdentity user={user} activeHoverClass="user-containers active-hover"/>
              </div>
          ))}
        </div>
    </div>
    );
}

export default Search;
