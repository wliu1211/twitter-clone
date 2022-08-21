import React, {useState, useEffect, useContext} from 'react';
import './HomeScreen.css';
import { TextField } from '@material-ui/core';
import {AuthContext} from '../../App';
import {TweetContext} from '../TwitterHome/TwitterHome';
import { Button } from '@mui/material';
import TweetList from './TweetList/TweetList';

 
function HomeScreen({userInformation}) {
 const {tweetService} = useContext(TweetContext);
 const {authService} = useContext(AuthContext);
 const [tweetInput, setTweetInput] = useState('');
 const [tweetsList, setTweetsList] = useState([]);
 const [loaded, setLoaded] = useState(false);
 
 
  useEffect(() => {
    authService.findUser(userInformation.id).then((targetUser) => {
      const {success, user} = targetUser.data;
      const selfInfo =  {"userId": userInformation.id};
      if (success) {
        const followingsList = [...user.followings, selfInfo];
        tweetService.getAllTweets().then((res) => {
          const {data, status} = res;
          if(status === 200){
            const filteredList = data.data.filter(tweet => {
              return followingsList.some((followingUser) => {
                return followingUser.userId === tweet.userId;
              })
            })
            setTweetsList([...filteredList]);
            setLoaded(true);
          }
        }).catch(err => {
          console.error(err);
        })
      }  
    }).catch(err => {
      console.error(err);
    })
  }, [])

  const handleTweetClick = () => {
    if (!!tweetInput){
      const tweetDetails = {
        "name": userInformation.name,
        "twitterHandle": userInformation.twitterHandle,
        "userId": userInformation.id,
        "text": tweetInput,
        "picture": userInformation.picture,
        "timestamp": new Date(),
        "likedTweets": [],
        "comments": [],
        "retweets": [],
        "retweetTweetId": "",
        "retweetName": "",
        "retweetActive": false,
      }
      tweetService.postTweet(tweetDetails).then((newTweet) => {
        setTweetsList([...tweetsList, newTweet]);
      }).catch((err) => {
        console.error(`Error in adding new tweet ${err}`);
      })
      setTweetInput('');
    }
  }
  
 return (
   <div className="home-screen">
       <header className="home-screen-header">
         <h3>Home</h3>
       </header>
       <div className="home-tweet-container">
         <div className='tweet-header'>
           <div className="avatar-img-wrapper">
             <img className="avatar-img" src={userInformation.picture} alt="" />
           </div>
           <textarea className='tweet-input' cols="65" rows="10" onChange={({target: {value}}) => setTweetInput(value)} value={tweetInput}/>
         </div>
         <div className="tweet-btn-container">
           <Button className="btn btn-primary" onClick={handleTweetClick}>
             <p>Tweet</p>
           </Button>
         </div>
         <div className="tweet-list">
           {loaded ? tweetsList.map(tweet => (
            <TweetList key={tweet._id} tweetInfo={tweet} prevTweetsList={tweetsList} setPrevList={setTweetsList}/>
           )) : <div style={{margin: '30px'}}> Loading Tweets....</div>}
         </div>
       </div>
   </div>
 );
}
export default HomeScreen;