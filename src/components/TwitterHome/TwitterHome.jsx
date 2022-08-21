import React, {useState, useEffect, useContext, createContext} from 'react';
import {TweetService, FollowService, NotificationService, MessageService} from '../../services';
import Broadcast from '../Broadcast/Broadcast';
import Nav from '../Nav/Nav';
import Search from '../Search/Search';
import "./TwitterHome.css";


const tweetService = new TweetService();
const followService = new FollowService();
const notiService = new NotificationService();
const messageService = new MessageService();
 
export const TweetContext = createContext();
export const UserSearchContext = createContext({});
export const FollowContext = createContext();
export const NotificationContext = createContext();
export const NavContext = createContext();
export const MessageContext = createContext();


const TweetProvider = ({children}) => {
 const context = {
   tweetService,
 
 }
 const [tweetContext, setTweetContext] = useState(context);
 return (
   <TweetContext.Provider value={tweetContext}>
     {children}
   </TweetContext.Provider>
 )
 
}
 
const UserSearchProvider = ({children}) => {
  const context = {
    selectedUser: {},
    setSelectedUser: (user) => {
      setUserSearchContext({...userSearchContext, selectedUser: user});
    },
  }

  const [userSearchContext, setUserSearchContext] = useState(context);
  return(
    <UserSearchContext.Provider value={userSearchContext}>
      {children}
    </UserSearchContext.Provider>
  )
}

const FollowProvider = ({children}) => {
  const context = {
    followService,

  }
  const [followContext, setFollowContext] = useState(context);
  return (
    <FollowContext.Provider value={followContext}>
      {children}
    </FollowContext.Provider>
  )
}

const NotificationProvider = ({children}) => {
  const context = {
    notiService,
  }
  const [notiContext, setNotiContext] = useState(context);
  return(
    <NotificationContext.Provider value={notiContext}>
      {children}
    </NotificationContext.Provider>
  )
}

const MessagesProvider = ({children}) => {
  const context = {
    messageService,
  }
  const [messageContext, setMessageContext] = useState(context);
  return (
    <MessageContext.Provider value={messageContext}>
      {children}
    </MessageContext.Provider>
  )
}

const NavProvider = ({children}) => {
  const context = {
    selectedNav: "home", 
    setSelectedNav: (nav) => {
      setNavContext({...navContext, selectedNav: nav});
    }
  }
  const [navContext, setNavContext] = useState(context);
  return(
    <NavContext.Provider value={navContext}>
      {children}
    </NavContext.Provider>
  )
}

function TwitterHome() {

 return (
   <section className='twitter-home-section'>
       <div className="home-container">
        <NavProvider>
         <TweetProvider>
          <FollowProvider>
            <UserSearchProvider>
              <NotificationProvider>
                <MessagesProvider>
                  <Nav />
                  <Broadcast />
                  <Search />
                </MessagesProvider>
              </NotificationProvider>
            </UserSearchProvider>
          </FollowProvider>
         </TweetProvider>
        </NavProvider>
       </div>
   </section>
   );
}
 
export default TwitterHome;
