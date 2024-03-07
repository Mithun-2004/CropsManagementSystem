import React from 'react';
import {Link} from 'react-router-dom';

export default function AllUsersButton(){
    const isAdmin = JSON.parse(localStorage.getItem('userInfo')).isAdmin;
  
    return(
        <div className="allUsersButtonWrapper">
        <Link id="allUsersButton" to={isAdmin ? "/admin/allUsers" : "/farmer/allUsers"}><i className="ri-user-line"></i></Link>
        </div>
    )  
}