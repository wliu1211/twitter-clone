import React, {useState, useEffect, useContext} from 'react'
import "./CommentTweetModal.css"
import Modal from '../../Modal/Modal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComment, faRetweet, faHeart, faShareFromSquare } from '@fortawesome/free-solid-svg-icons'
import {AuthContext} from '../../../App'
import {TweetContext, NotificationContext} from '../../TwitterHome/TwitterHome';
const moment = require('moment');
const unlikedHeart = 'rgb(100,104,109)';
const likedHeart = 'red';
const retweetActive = 'limegreen';
const retweetDisabled = 'rgb(100,104,109)';
function CommentTweetModal({openComments, closeComments, tweetTarget}) {
    const {tweetService} = useContext(TweetContext);
    const {authService} = useContext(AuthContext);
    const {notiService} = useContext(NotificationContext);
    const [likedList, setLikedList] = useState(tweetTarget.likedTweets);
    const [loaded, setLoaded] = useState(true);

    const [tweetLiked, setTweetLiked] = useState(false);
    const [openLiked, setOpenLiked] = useState(false);
    const [tweetRetweeted, setTweetRetweeted] = useState(false);

    const [openComment, setOpenComment] = useState(false);
    const [commentInput, setCommentInput] = useState('');
    const [commentList, setCommentList] = useState([]);
    const [retweetList, setRetweetList] = useState([]);


    useEffect(() => {
      tweetService.getTweet(tweetTarget._id).then((tweet) => {
        if (tweet.data.success) {
            const {comments,retweets, likedTweets} = tweet.data.tweet;
            setCommentList([...comments]);
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
      }).catch(err => {
        console.error(`Error in getting tweet ${err}`);
      })
    }, [openComments])

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
            // setLikedTweetCount();
        }
        if (authService.id !== targetTweetInfo.userId) {
            notiService.addNotifications(targetTweetInfo, authService, tweetAction);
            
        }
    }

    const likedCountClick = () => {
        setOpenLiked(!openLiked);
    }
    

    const commentClick = () => {
        setOpenComment(!openComment);
    }

    const replyClicked = () => {
      if (!!commentInput) {
        const tweetAction = 'comment';
        const commentInfo = {
          "name": authService.name,
          "twitterHandle": authService.twitterHandle, 
          "picture": authService.picture,
          "text": commentInput,
        }
        tweetService.addTweetComment(tweetTarget, authService, commentInput);
        setCommentList([...commentList, commentInfo]);
        setCommentInput('');
        if (authService.id !== tweetTarget.userId) {
          notiService.addNotifications(tweetTarget, authService, tweetAction);
        }
      }
    }
    
  return (
    <Modal title={<p style={{color: 'white'}}>Comments</p>} isOpen={openComments} close={closeComments}>
    {loaded ? 
        <div className="comment-item-wrapper">
          <div className="comment-detail-container">
            <div className="comment-item-header">
              <div className="comment-img-container">
                <img src={tweetTarget.picture} alt="" />
              </div>
              <div className="comment-header-identity">
                <h3>{tweetTarget.name}</h3>
                <p>@{tweetTarget.twitterHandle}</p>
              </div>
            </div>
            <div className="comment-item-body">
              <p>{tweetTarget.text}</p>
            </div>
            <div className="comment-item-timestamp">
              <p>{moment(tweetTarget.timeStamp).format("LT")}<div></div>{moment(tweetTarget.timeStamp).format("ll")}</p>
            </div>
          </div>
          <div className="comment-responses-container">
            <div className="action-item-container" onClick={() => commentClick()}>
                  <FontAwesomeIcon className="action-icon" icon={faComment} />
                  <p>{commentList.length}</p>
              </div>
              <div className="action-item-container">
                  <FontAwesomeIcon style={{color: `${tweetRetweeted ? retweetActive : retweetDisabled}`}} className="action-icon" icon={faRetweet} />
                  <p>{retweetList.length}</p>
              </div>
              <div className="action-item-container">
                  <FontAwesomeIcon className="action-icon" style={{color: `${tweetLiked ? likedHeart : unlikedHeart}`}} icon={faHeart} onClick={() => addLikeTweet(tweetTarget)}/>
                  <p onClick={() => likedCountClick()}>{likedList.length}</p>
              </div>
              <div className="action-item-container" >
                  <FontAwesomeIcon className="action-icon" icon={faShareFromSquare} />
              </div>
          </div>
          <div className="comment-user-reply">
            <textarea name="" id="" cols="71" rows="5" value={commentInput} onChange={({target: {value}}) => setCommentInput(value)}></textarea>
            <div className="reply-btn-container">
              <button className="reply-btn" onClick={() => replyClicked()}>
                <p>Reply</p>
              </button>
            </div>
          </div>
          <div className="comment-replies-container">
            {commentList.length ? commentList.map((comment) =>(
              <div key={comment._id} className="replies-identity-container">
                <div className="replies-img-container">
                  <img src={comment.picture} alt="" />
                </div>
                <div className="replies-detail-container">
                  <h4>{comment.name}</h4>
                  <p className="replies-twitter-handle">@{comment.twitterHandle}</p>
                  <p className="replies-text-container">{comment.text}</p>
                </div>
              </div>

            )) : <div>Be the first to comment!</div>}
          </div>
        </div>
    : <div>Loading...</div>}
</Modal>
  )
}

export default CommentTweetModal