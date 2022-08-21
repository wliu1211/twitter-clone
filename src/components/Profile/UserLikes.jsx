import React, {useState, useEffect, useContext} from 'react'
import TweetList from '../HomeScreen/TweetList/TweetList'
import {TweetContext} from '../TwitterHome/TwitterHome';
import {AuthContext} from '../../App';


function UserTweets({info}) {
    const {tweetService} = useContext(TweetContext);
    const {authService} = useContext(AuthContext);
    const [likedList, setLikedList] = useState([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        tweetService.getAllTweets().then((res) => {
            const {data, status} = res;
          if(status === 200){
            const filteredList = data.data.filter(tweet => {
              return tweet.likedTweets.some(likedTweet => likedTweet.userId === info.id)
            })
            setLikedList(filteredList);
          }
          setLoaded(true);
        });
    }, [info])
    
  return (
    <div className="user-action-display">
        {loaded ? likedList.map(likedTweet => (
            <TweetList key={likedTweet._id} tweetInfo={likedTweet}/>
        )) : <div style={{margin: '30px'}}> Loading liked tweets...</div>}
        {loaded && !likedList.length ?  <div style={{margin: '30px'}}> No liked tweets...</div> : <div></div>}
    </div>
  )
}

export default UserTweets