import axios from 'axios';
import avatar from './assets/images/defaultAvatar.png'

const LOCAL_URL = 'http://localhost:5000';
const LOCAL_URL_BASE = `${LOCAL_URL}/api/v1/twitter-clone`;
const LOCAL_URL_BASE_USERS = `${LOCAL_URL_BASE}/users`;
const LOCAL_URL_BASE_ACCOUNTS = `${LOCAL_URL_BASE}/accounts`;
const LOCAL_URL_BASE_TWEETS = `${LOCAL_URL_BASE}/tweets`;
const LOCAL_URL_BASE_NOTIS = `${LOCAL_URL_BASE}/notifications`;
const LOCAL_URL_BASE_MESSAGES = `${LOCAL_URL_BASE}/messages`;
export class User {
   constructor(){
       this.name = '';
       this.email = '';
       this.twitterHandle = '';
       this.picture = avatar;
       this.phone = 0;
       this.id = '';
       this.accountId = '';
       this.birthDate = new Date();
       this.joinedDate = new Date();
       this.isLoggedIn = false; //true or false switcher
    }
   setUserEmail = (email) => {this.email = email}
   setIsLoggedIn = (loggedIn) => {this.isLoggedIn = loggedIn}
 
   setUserData = (userData, accountId) => {
       const {name, email, twitterHandle, phone, birthDate, joinedDate, _id} = userData;
       this.name = name;
       this.email = email;
       this.twitterHandle = twitterHandle;
       this.phone = phone;
       this.birthDate = birthDate;
       this.joinedDate = joinedDate;
       this.id = _id;
       this.accountId = accountId;
   }
   setPrimaryUserData = (newData) => {
    const {name, twitterHandle, phone} = newData;
    this.name = name;
    this.twitterHandle = twitterHandle;
    this.phone = phone;
   }
}
 
export class AuthService extends User{
    logoutUser (){
         this.name = '';
         this.email = '';
         this.twitterHandle = '';
         this.picture = avatar;
         this.phone = 0;
         this.id = '';
         this.accountId = '';
         this.birthDate = new Date();
         this.joinedDate = new Date();
         this.isLoggedIn = false;
     }
   registerAccount = async (userLogin) => {
       try {
           const response = await axios.post(LOCAL_URL_BASE_ACCOUNTS, userLogin);
           return response;
       } catch (error) {
           console.error(error);
           throw error;
       }
   }
   getAccounts = async () => {
       try {
           const response = await axios.get(LOCAL_URL_BASE_ACCOUNTS);
           return response;
       } catch (error) {
           console.error(error);
           throw error;
       }
   }

   changePassword = async (accountId, password) => {
    const newPassword = {
        "password": password
    }
        try {
            const response = await axios.put(`${LOCAL_URL_BASE_ACCOUNTS}/${accountId}`, newPassword);
           return response;
        } catch (error) {
            console.error(error);
            throw error;
        }
   }
   deleteAccount = async (accountId) => {
        try {
            await axios.delete(`${LOCAL_URL_BASE_ACCOUNTS}/${accountId}`);
        } catch (error) {
            console.error(error);
            throw error;
        }
   }
   
   findUserByEmail = async (email) => {
        try {
            const response = await axios.get(`${LOCAL_URL_BASE_USERS}/findEmail/${email}`);
            return response;
        } catch (error) {
            console.error(error);
            throw error;
        }
   }
   findUserByTwitterHandle = async (twitterHandle) => {
        try {
            const response = await axios.get(`${LOCAL_URL_BASE_USERS}/findTwitterHandle/${twitterHandle}`);
            return response;
        } catch (error) {
            console.error(error);
            throw error;
        }
   }
   loginUser = async(email, password) => {
    await this.getAccounts().then((res) => {
        const {data} = res.data;
        data.forEach((account) => {
            if (account.email === email && account.password === password) {
                this.findUserByEmail(email).then((targetUser) => {
                    const {user} = targetUser.data;
                    this.setUserEmail(email);
                    this.setUserData(user, account._id);
                })
                this.setIsLoggedIn(true);
                return this.isLoggedIn;
            } else {
                console.log("No user with email " + email + " or wrong password.");
                return this.isLoggedIn;
            }
        })
    })
   }
   addUser = async (userDetails) => {
       const {name, email, picture, twitterHandle, phone, birthdate, joinedDate} = userDetails;
       const user = {
           "name": name,
           "email": email, 
           "picture": picture,
           "twitterHandle": twitterHandle,
           "phone": phone.length === 0 ? 0 : phone,
           "birthDate": birthdate,
           "joinedDate": joinedDate, 
       }

       try {
           await axios.post(LOCAL_URL_BASE_USERS, user);
       } catch (error) {
           console.error(`Error: ${error}`);
           throw error;
       }
   }
   getUsers = async () => {
       try {
           const response = await axios.get(LOCAL_URL_BASE_USERS);
           return response;
       } catch (error) {
            console.error(error);
           throw error;
       }
   }
   findUser = async (userId) => {
        try {
            const response = await axios.get(`${LOCAL_URL_BASE_USERS}/${userId}`);
            return response;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    editUser = async (userId, userInfo) => {
        try {
            const response = await axios.put(`${LOCAL_URL_BASE_USERS}/${userId}`, userInfo);
            return response;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    deleteUser = async (userId) => {
        try {
            await axios.delete(`${LOCAL_URL_BASE_USERS}/${userId}`);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

}

 
export class TweetService {
   constructor(){
       this.tweets = [];
   }
 
   postTweet = async (tweetInfo) => {
       try {
            const response = await axios.post(LOCAL_URL_BASE_TWEETS, tweetInfo);
            if (response.data.success) {
                return response.data.tweet;
                
            }
       } catch (error) {
            console.error(error);
            throw error;
       }
   }

   getAllTweets = async () => {
       try {
           const response = await axios.get(LOCAL_URL_BASE_TWEETS);
           return response;
       } catch (error) {
           console.error(error);
           throw error;
       }
   }

   getTweet = async (tweetId) => {
       try {
            const tweet = await axios.get(`${LOCAL_URL_BASE_TWEETS}/${tweetId}`);
            return tweet;
        } catch (error) {
            console.error(error);
            throw error;
        }
   }
   editTweet = async (tweetId, tweetInfo) => {
        try {
            const response = await axios.put(`${LOCAL_URL_BASE_TWEETS}/${tweetId}`, tweetInfo);
            return response;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    deleteTweet = async (tweetId) => {
        try {
            await axios.delete(`${LOCAL_URL_BASE_TWEETS}/${tweetId}`);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    
   addLikedTweet = async (tweetInfo, userInfo) => {
        const newInfo = {
            "name": userInfo.name,
            "userId": userInfo.id,
            "twitterHandle": userInfo.twitterHandle,
            "picture": userInfo.picture
        }
        try {
            const response = await axios.put(`${LOCAL_URL_BASE_TWEETS}/add-liked-tweet/${tweetInfo._id}`, newInfo);
            return response;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    removeLikedTweet = async (tweetInfo, userInfo) => {
        const newInfo = {
            "userLikedId": userInfo.id
        }
        try {
            const response = await axios.put(`${LOCAL_URL_BASE_TWEETS}/remove-liked-tweet/${tweetInfo._id}`, newInfo);
            return response;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
   addRetweet = async (tweetInfo, newTweet, userInfo) => {
       const newInfo = {
           "name": userInfo.name,
           "userId": userInfo.id,
           "twitterHandle": userInfo.twitterHandle,
           "picture": userInfo.picture,
            "retweetTweetId": newTweet._id
        }
        try {
            const response = await axios.put(`${LOCAL_URL_BASE_TWEETS}/add-retweet/${tweetInfo._id}`, newInfo);
            return response;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    removeRetweet = async (tweetInfo, userInfo) => {
        const newInfo = {
            "retweetUserId": userInfo.id
        }
        try {
            const response = await axios.put(`${LOCAL_URL_BASE_TWEETS}/remove-retweet/${tweetInfo._id}`, newInfo);
            return response;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    
    
    addTweetComment = async (tweetInfo, authService, comment) => {

        const commentInfo = {
            "name": authService.name,
            "twitterHandle": authService.twitterHandle, 
            "picture": authService.picture,
            "text": comment,
        }
        try {
            await axios.put(`${LOCAL_URL_BASE_TWEETS}/add-tweet-comment/${tweetInfo._id}`, commentInfo)
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    deleteTweetComment = async (tweetInfo, userInfo) => {
        const newInfo = {
            "tweetCommentId": userInfo.id 
        }
        try {
            await axios.put(`${LOCAL_URL_BASE_TWEETS}/remove-tweet-comment/${tweetInfo._id}`, newInfo)
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    
}


export class FollowService {
    addFollower = async (targetId, followerInfo) => {
        const info = {
            "name": followerInfo.name,
            "twitterHandle": followerInfo.twitterHandle,
            "picture": followerInfo.picture,
            "userId": followerInfo.id,
        }
        try {
            const response = await axios.put(`${LOCAL_URL_BASE_USERS}/add-follower/${targetId}`, info);
            return response;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    addFollowing = async (authId, followingInfo) => {
        const info = {
            "name": followingInfo.name,
            "twitterHandle": followingInfo.twitterHandle,
            "picture": followingInfo.picture,
            "userId": followingInfo.id,
        }
        try {
            await axios.put(`${LOCAL_URL_BASE_USERS}/add-following/${authId}`, info);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    removeFollower = async (targetId, followerInfo) => {
        const deleteInfo = {
            followersId: followerInfo.id
        }
        try {
            const response = await axios.put(`${LOCAL_URL_BASE_USERS}/remove-follower/${targetId}`, deleteInfo);
            return response;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    removeFollowing = async (authId, followingInfo) => {
        const deleteInfo = {
            followingsId: followingInfo.id
        }
        try {
            const response = await axios.put(`${LOCAL_URL_BASE_USERS}/remove-following/${authId}`, deleteInfo);
            return response;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

export class NotificationService {
    addNotifications = async (targetInfo, authService, tweetAction) => {
        const notiInfo = {
            "fromUserId": authService.id,
            "fromUserName": authService.name,
            "fromUserPicture": authService.picture,
            "notiAction": tweetAction,
            "toUserId": targetInfo.userId,
            "targetTweetId": targetInfo._id
        }
        try {
            await axios.post(LOCAL_URL_BASE_NOTIS, notiInfo);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    getNotifications = async () => {
        try {
            const response = await axios.get(LOCAL_URL_BASE_NOTIS);
            return response;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

}

export class MessageService {

    getMessages = async () => {
        try {
            const response = await axios.get(LOCAL_URL_BASE_MESSAGES);
            return response;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    
    addMessage = async (targetInfo, authInfo) => {
        const msgInfo = {
            "toUserId": targetInfo._id,
            "fromUserId": authInfo.id,
            "toName": targetInfo.name,
            "toTwitterHandle": targetInfo.twitterHandle,
            "toPicture": targetInfo.picture,
            "fromName": authInfo.name,
            "fromTwitterHandle": authInfo.twitterHandle,
            "fromPicture": authInfo.picture,
            "privateMsg": []
        }
        try {
            await axios.post(LOCAL_URL_BASE_MESSAGES, msgInfo);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    deleteMessage = async (targetMsg) => {
        try {
            await axios.delete(`${LOCAL_URL_BASE_MESSAGES}/${targetMsg}`)
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    addDmMessage = async (authId, targetUser, text) => {
        const info = {
            "toUserId": targetUser.toUserId,
            "fromUserId": authId.id, 
            "name": authId.name, 
            "twitterHandle": authId.twitterHandle, 
            "picture": authId.picture,
            "text": text,
        }
        try {
            const response = await axios.put(`${LOCAL_URL_BASE_MESSAGES}/add-dm-messages/${targetUser._id}`, info);
            if (response.data.success) {
                return response.data.data;
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    getMessage = async (messageId) => {
        try {
            const response = await axios.get(`${LOCAL_URL_BASE_MESSAGES}/${messageId}`);
            return response;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}