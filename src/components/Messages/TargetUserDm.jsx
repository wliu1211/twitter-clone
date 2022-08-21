import React, {useState, useEffect, useContext} from 'react'
import "./Messages.css"
import {AuthContext} from '../../App';
import {MessageContext} from '../TwitterHome/TwitterHome'
import DmText from './DmText/DmText';


function TargetUserDm({selectedUser, text, setText}) {
    const {authService} = useContext(AuthContext);
    const {messageService} = useContext(MessageContext);
    const [targetUser, setTargetUser] = useState(selectedUser);
    const [messagesList, setMessagesList] = useState([]);
    const [error, setError] = useState(false);
    useEffect(() => {
        messageService.getMessage(selectedUser._id).then((res) => {
            const {success, message} = res.data;
            if (success) {
                const revList = message.privateMsg.reverse();
                setMessagesList(revList);
            }
          }).catch((error) => {
            console.error(error);
            setError(true);
          })
        if(selectedUser.toUserId === authService.id){
            const user = {
              "_id":selectedUser._id,
              "name": selectedUser.fromName,
              "twitterHandle": selectedUser.fromTwitterHandle,
              "picture": selectedUser.fromPicture,
            }
            setTargetUser(user)
          } else if(selectedUser.fromUserId === authService.id){
            const user = {
              "_id": selectedUser._id,
              "name": selectedUser.toName,
              "twitterHandle": selectedUser.toTwitterHandle,
              "picture": selectedUser.toPicture,
            }
            setTargetUser(user)
          }
    }, [selectedUser])

   
    const sendMessageClicked = () => {
        if(!!text){
          messageService.addDmMessage(authService, selectedUser, text).then(res => {
            const info = {
              "toUserId": selectedUser.toUserId,
              "fromUserId": authService.id, 
              "name": authService.name, 
              "twitterHandle": authService.twitterHandle, 
              "picture": authService.picture,
              "text": text,
          }
            setMessagesList([info, ...messagesList])
          })
          setText('');

        }
      }
  return (
    <div className="message-right-container">
        <div className="dm-header-container">
            <h3>{targetUser.name}</h3>
            <p>@{targetUser.twitterHandle}</p>
        </div>
        <div className="dm-body-container">
            {messagesList.length ? messagesList.map((message) => (
                <DmText textInfo={message}/>
            )) : <div style={{position: 'absolute', top: '20px', left: '5%', }}>Start a conversation with {targetUser.name}</div>}
        </div>
            <div className="dm-footer-container">
            <textarea name="" id="" cols="33" rows="5" value={text} onChange={({target: {value}}) => setText(value)}></textarea>
            <div className="dm-submit-container">
                <button onClick={sendMessageClicked} className="dm-send-btn">Send</button>
            </div>
        </div>
    </div>
  )
}

export default TargetUserDm