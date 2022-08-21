import React, {useState, useEffect, useContext} from 'react'
import "./LikedTweetList.css"
import Modal from '../../Modal/Modal'
import {AuthContext} from '../../../App'
import {TweetContext} from '../../TwitterHome/TwitterHome';
import UserIdentity from '../../UserIdentity/UserIdentity';

function LikedTweetList({openLikedList, closeLikedList, tweetTarget}) {
    const {tweetService} = useContext(TweetContext);
    const {authService} = useContext(AuthContext);
    const [likedList, setLikedList] = useState(tweetTarget.likedTweets);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        tweetService.getTweet(tweetTarget._id).then((user) =>{
            const {tweet, success} = user.data
            if (success) {
                setLikedList([...tweet.likedTweets]);
                setLoaded(true);
            } 
        }).catch((error) => {
            console.error(error);
        })      
    }, [openLikedList])
    
    return (
        <Modal title={<p style={{color: 'white'}}>Liked Users</p>} isOpen={openLikedList} close={closeLikedList}>
            {loaded ? likedList.map((user) => (
                <UserIdentity key={user._id} user={user} activeHoverClass="user-containers active-border"/>
            )): <div>Loading...</div>}
        </Modal>
    )
}

export default LikedTweetList
