import React, {useState, useEffect, useContext}  from 'react'
import "./DmText.css"
import {AuthContext} from '../../../App';
import {MessageContext} from '../../TwitterHome/TwitterHome'

function DmText({textInfo}) {
  const {authService} = useContext(AuthContext);
  const {fromUserId} = textInfo;
  return (
    <div className={fromUserId === authService.id ? "text-bubble-container user-side" : "text-bubble-container client-side"}>
        <div className="text-img-container">
            <img src={textInfo.picture} alt="" />
        </div>
        <div className="text-detail-container">
            <div className="text-credential-wrapper">
                <h4 className="cred-name">{textInfo.name}</h4>
                <p className="cred-twitterHandle">@{textInfo.twitterHandle}</p>
            </div>
            <p className="dm-text">{textInfo.text}</p>
        </div>
    </div>
  )
}

export default DmText