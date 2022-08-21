import React, {useState, useEffect, useContext} from 'react';
import "./Notifications.css"
import {AuthContext} from '../../App'
import { faComment, faHeart, faRetweet } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {TweetContext, NotificationContext} from '../TwitterHome/TwitterHome';





function Notifications() {
  const {tweetService} = useContext(TweetContext);
  const {authService} = useContext(AuthContext);

  const {notiService} = useContext(NotificationContext);
  const [notiList, setNotiList] = useState([]);
  const [notiTabSwitcher, setNotiTabSwitcher] = useState('all');
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => {
    notiService.getNotifications().then((res) => {
      const {success, notifications} = res.data;
      if (success) {
        const filteredList = notifications.filter(noti => noti.toUserId === authService.id)
        const recentTweetList = filteredList.reverse();
        setNotiList([...recentTweetList]);
      }
      setLoaded(true);
    })
  }, [])
  
  const displayNotiDetails = (notiInfo) => {
    const {notiAction, fromUserName} = notiInfo
    switch (notiAction) {
      case 'like':
        return (
          <div className="noti-info-container">
            <FontAwesomeIcon className="noti-icon" icon={faHeart} />
            <p>{fromUserName} liked your tweet.</p>
          </div>
        )
      case 'comment':
        return (
          <div className="noti-info-container">
            <FontAwesomeIcon className="noti-icon" icon={faComment} />
            <p>{fromUserName} commented on your tweet.</p>
          </div>
        )
      case 'retweet':
        return (
          <div className="noti-info-container">
            <FontAwesomeIcon className="noti-icon" icon={faRetweet} />
            <p>{fromUserName} retweeted your tweet.</p>
          </div>
        )
      default:
        break;
    }
  }
  return (
    <div className="notifications-section">
        <div className="notifications-header">
          <h3>Notifications</h3>
        </div>
        <div className="notifications-switch-container">
          <div className={notiTabSwitcher === 'all' ? "switch-item-container selected" : "switch-item-container"} onClick={() => setNotiTabSwitcher('all')}>
            <h3>All</h3>
          </div>
          <div className={notiTabSwitcher === 'mentions' ? "switch-item-container selected" : "switch-item-container"} onClick={() => setNotiTabSwitcher('mentions')}>
            <h3>Mentions</h3>
          </div>
        </div>


        {notiTabSwitcher === 'all' ? <div className="notifications-list-container">
          {loaded ? notiList.map((noti) => (
            <div className="notifications-item-container">
              <div className="noti-img-container">
                <img src={noti.fromUserPicture} alt="" />
              </div>
              {displayNotiDetails(noti)}
            </div>
          )) : <div style={{margin: '30px'}}> Loading Notifications...</div>}
        </div> : <div style={{margin: '30px'}}>No Mentions Yet...</div>}
    </div>
    );
}

export default Notifications;
