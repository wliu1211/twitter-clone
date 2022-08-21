import React, {useState, useEffect, useContext} from 'react'
import "./UserIdentity.css"

function UserIdentity({user, activeHoverClass}) 
{    
  return (
    <div key={user._id} className={activeHoverClass}>
        <div className="user-img-container">
            <img src={user.picture} alt="user" />
        </div>
        <div className="user-identity-container">
            <h3>{user.name}</h3>
            <p>@{user.twitterHandle}</p>
        </div>
    </div>
  )
}

export default UserIdentity