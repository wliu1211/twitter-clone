import React, { useState, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComment, faRetweet, faHeart, faShareFromSquare } from '@fortawesome/free-solid-svg-icons'
import {AuthContext} from '../../../App'
import {TweetContext, NotificationContext} from '../../TwitterHome/TwitterHome';
import LikedTweetList from '../TweetResponse/LikedTweetList';
import CommentTweetModal from '../TweetResponse/CommentTweetModal';

const moment = require('moment');

const unlikedHeart = 'rgb(100,104,109)';
const likedHeart = 'red';
const retweetActive = 'limegreen';
const retweetDisabled = 'rgb(100,104,109)';

function TweetList({tweetInfo, prevTweetsList, setPrevList})
 {
    const {tweetService} = useContext(TweetContext);
    const {notiService} = useContext(NotificationContext);
    const {authService} = useContext(AuthContext);
    const [tweetLiked, setTweetLiked] = useState(false);
    const [openLiked, setOpenLiked] = useState(false);
    const [likedList, setLikedList] = useState(tweetInfo.likedTweets)
    const [openComment, setOpenComment] = useState(false);
    const [editTextInput, setEditTextInput] = useState('');
    const [commentText, setCommentText] = useState(tweetInfo.text);
    const [commentList, setCommentList] = useState(tweetInfo.comments);
    const [editClicked, setEditClicked] = useState(false);
    const [tweetRetweeted, setTweetRetweeted] = useState(false);
    const [retweetList, setRetweetList] = useState([]);
    
    useEffect(() => {
        tweetService.getTweet(tweetInfo._id).then((tweet) => {
          if (tweet.data.success) {
              const {comments, likedTweets, retweets, text} = tweet.data.tweet;
              setCommentList([...comments]);
              setEditTextInput(text);
              if (likedTweets.some(likedUsers => likedUsers.userId === authService.id)) {
                setTweetLiked(true);
            } else {
                setTweetLiked(false);
            }
              if (retweets.some(retweetUsers => retweetUsers.userId === authService.id)) {
                setTweetRetweeted(true);
            } else {
                setTweetRetweeted(false);
            }
              setLikedList([...likedTweets]);
              setRetweetList([...retweets]);
          }
        })
    }, [openComment])    

    const addLikeTweet = (targetTweetInfo) =>{
        const tweetAction = 'like';
        const newInfo = {
            "name": authService.name,
            "userId": authService.id,
            "twitterHandle": authService.twitterHandle,
            "picture": authService.picture
        }
        if (!tweetLiked) {
            tweetService.addLikedTweet(targetTweetInfo, authService);
            setTweetLiked(true);
            setLikedList([...likedList, newInfo])
        } else {
            tweetService.removeLikedTweet(targetTweetInfo, authService);
            setTweetLiked(false);
            const filteredList = likedList.filter(likedUser => likedUser.userId !== authService.id)
            setLikedList(filteredList);
        }
        if (authService.id !== targetTweetInfo.userId) {
            notiService.addNotifications(targetTweetInfo, authService, tweetAction);
            
        }
    }
       
    const editTweetClicked = () => {
        setEditClicked(true);
        setEditTextInput(tweetInfo.text);
    }
    const saveEditTweet = () => {
        const newTweet = {
            "text": editTextInput
        }
        setEditClicked(false);
        tweetService.editTweet(tweetInfo._id, newTweet).then((res) => {
            const {success, tweet} = res.data;
            if (success) {
                setCommentText(tweet.text);
                setEditTextInput(tweet.text);
            }
        }).catch((error) => {
            console.error(error);
        })
    }
    const deleteTweet = (tweetId) => {
        tweetService.deleteTweet(tweetId);
        const filteredList = prevTweetsList.filter(tweet => tweet._id !== tweetId);
        setPrevList(filteredList);
        setEditClicked(false);
        setCommentText(tweetInfo.text);
    }
    const deleteClicked = () => {
        if (tweetInfo.retweetActive) {
            const tweet = {
                "_id": tweetInfo.retweetTweetId
            }            
            tweetService.removeRetweet(tweet, authService)
        } 
        deleteTweet(tweetInfo._id)
    }
    const retweetClick = () => {
        const tweetAction = 'retweet';
        const newInfo = {
            "name": authService.name,
            "userId": authService.id,
            "twitterHandle": authService.twitterHandle,
            "picture": authService.picture,
            "retweetTweetId": ""
        }
        const tweetDetails = {
            "name": tweetInfo.name,
            "twitterHandle": tweetInfo.twitterHandle,
            "text": tweetInfo.text,
            "userId": authService.id,
            "picture": tweetInfo.picture,
            "timestamp": new Date(),
            "likedTweets": likedList,
            "comments": commentList,
            "retweets": [...retweetList, newInfo],
            "retweetTweetId": tweetInfo._id,
            "retweetName": authService.name,
            "retweetUserId": authService.id,
            "retweetActive": true,
        }
        if (!tweetRetweeted) {
            tweetService.postTweet(tweetDetails).then((newTweet) => {
                const newRetweetUserArrInd = newTweet.retweets[newTweet.retweets.length - 1]
                const newRetweetUser = {
                    "name": newRetweetUserArrInd.name,
                    "userId": newRetweetUserArrInd.userId,
                    "twitterHandle": newRetweetUserArrInd.twitterHandle,
                    "picture": newRetweetUserArrInd.picture,
                    "retweetTweetId": newTweet._id
                }
                setPrevList([...prevTweetsList, newTweet]);
                setRetweetList([...retweetList, newRetweetUser])
                tweetService.addRetweet(tweetInfo, newTweet, authService);
            }).catch((err) => {
                console.error(`Error in adding new retweet ${err}`);
            })
            if (authService.id !== tweetInfo.userId) {
                notiService.addNotifications(tweetInfo, authService, tweetAction);
            }
            setTweetRetweeted(true);
        } else {
            if (tweetInfo.retweetActive) {
                const tweet = {
                    "_id": tweetInfo.retweetTweetId
                }            
                deleteTweet(tweetInfo._id);
                tweetService.removeRetweet(tweet, authService)
            } else {
                setTweetRetweeted(false);
                const filteredRetweetList = retweetList.filter(retweetUser => retweetUser.userId !== authService.id)
                const targetRetweetUser = retweetList.filter(retweetUser => retweetUser.userId === authService.id)
                tweetService.removeRetweet(tweetInfo, authService);
                setRetweetList(filteredRetweetList);
                deleteTweet(targetRetweetUser[0].retweetTweetId);
            }
        }
    }
   return (
       <div className="tweet-list-container">
            <div style={{display: `${tweetInfo.retweetActive ? 'flex' : 'none'}`}} className="retweet-header">
                <i class="fa-solid fa-retweet"></i>
                <p className="retweet-label">{tweetInfo.retweetUserId === authService.id ? "You" : `${tweetInfo.retweetName}`} retweeted</p>
          </div>
           <div className={tweetInfo.retweetActive ? "tweet-container retweet" : "tweet-container"}>
               <div className="avatar-img-wrapper">
                   <img className="avatar-img" src={tweetInfo.picture} alt="" />
               </div>
               <div className="tweet-detail-container">
                    <div style={{display: 'flex', justifyContent: 'space-between'}} className="detail-header-container">
                        <div className="detail-header">
                            <h4 className="user-name">{tweetInfo.name}</h4>
                            <p className="user-handle">@{tweetInfo.twitterHandle}</p>
                            <p className="tweet-timestamp">{moment(tweetInfo.timeStamp).startOf('hour').fromNow()}</p>
                        </div>
                        {editClicked && tweetInfo.userId === authService.id ? <i style={{display: `${ tweetInfo.userId === authService.id ? "block" : "none"}`}} className="fa-solid fa-floppy-disk edit-btn" onClick={saveEditTweet}></i> : <i style={{display: `${ tweetInfo.userId === authService.id ? "block" : "none"}`}} className="fa-solid fa-pen-to-square edit-btn" onClick={editTweetClicked}></i>}
                        {editClicked && <i className="fa-solid fa-xmark delete-tweet-btn" onClick={()=> deleteClicked()}></i>}
                        {editClicked && <i className="fa-solid fa-arrow-left-long cancel-edit-btn" onClick={() => setEditClicked(false)}></i>}
                    </div>
                   <div className="detail-body">
                        {editClicked ? <textarea className="tweet-edit-input" type="text" value={editTextInput} onChange={({target: {value}}) => setEditTextInput(value)} cols="30"></textarea> : <p>{commentText}</p>}
                   
                   </div>
                   <div className="detail-action-container">
                        <div className="action-item-container" onClick={() => setOpenComment(!openComment)}>
                            <FontAwesomeIcon className="action-icon" icon={faComment} />
                            <p>{commentList.length}</p>
                        </div>
                        <div className="action-item-container">
                            <FontAwesomeIcon style={{color: `${tweetRetweeted ? retweetActive : retweetDisabled}`}} className="action-icon" icon={faRetweet} onClick={() => retweetClick()}/>
                            <p>{retweetList.length}</p>
                        </div>
                        <div className="action-item-container">
                            <FontAwesomeIcon className="action-icon" style={{color: `${tweetLiked ? likedHeart : unlikedHeart}`}} icon={faHeart} onClick={() => addLikeTweet(tweetInfo)}/>
                            <p onClick={() => setOpenLiked(!openLiked)}>{likedList.length}</p>
                        </div>
                        <div className="action-item-container" >
                            <FontAwesomeIcon className="action-icon" icon={faShareFromSquare} />
                        </div>
                   </div>
               </div>
           </div>
           <CommentTweetModal openComments={openComment} closeComments={setOpenComment} tweetTarget={tweetInfo} />
           <LikedTweetList openLikedList={openLiked} closeLikedList={setOpenLiked} tweetTarget={tweetInfo}/>
       </div>
   )
}

export default TweetList;