import React, {useState, useEffect, useContext} from 'react'
import Modal from '../Modal/Modal'
import UserIdentity from '../UserIdentity/UserIdentity'
import {AuthContext} from '../../App'

function FollowList({title, openFollowsList, closeFollowsList, userInfo, action}) {
    const {authService} = useContext(AuthContext);
    const [followersList, setFollowersList] = useState([]);
    const [followingsList, setFollowingsList] = useState([]);

    useEffect(() => {
        authService.findUser(userInfo.id).then((data) => {
            const {user} = data.data;
            setFollowersList([...user.followers]);
            setFollowingsList([...user.followings])

          }).catch(err => {
            console.error(err);
          })

    }, [openFollowsList])
    const displayList = () => {
        if(action === 'followers'){
            return (
                followersList.map(follower => (
                    <UserIdentity user={follower} activeHoverClass="user-containers active-border"/>
                ))
            )
        } else {
            return (
                followingsList.map(following => (
                    <UserIdentity user={following} activeHoverClass="user-containers active-border"/>
                ))
            )
        }
    }
  return (
    <Modal title={<p style={{color: 'white'}}>{userInfo.name}'s {title}</p>} isOpen={openFollowsList} close={closeFollowsList}>
        {displayList()}
    </Modal>
  )
}

export default FollowList