import React, { useState, useEffect, useContext } from 'react'
import TweetList from '../HomeScreen/TweetList/TweetList'
import {TweetContext} from '../TwitterHome/TwitterHome';
import {AuthContext} from '../../App';



function UserTweets({info}) {
    const {tweetService} = useContext(TweetContext);
    const {authService} = useContext(AuthContext);
    const [tweetsList, setTweetsList] = useState([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        tweetService.getAllTweets().then((res) => {
            const {data, status} = res;
          if(status === 200){
            const filteredList = data.data.filter(tweet => {
              return tweet.userId === info.id;
            })
            setTweetsList(filteredList);
          }
        });
        setLoaded(true);
    }, [info])
    

  return (
    <div className="user-action-display">
        {loaded ? tweetsList.map(tweet => (
            <TweetList key={tweet._id} tweetInfo={tweet} prevTweetsList={tweetsList} setPrevList={setTweetsList}/>
        )) :  <div style={{margin: '30px'}}> Loading tweets...</div>}

    </div>
  )
}

export default UserTweets