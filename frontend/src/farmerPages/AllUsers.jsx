import React from 'react';
import {useEffect, useState} from 'react';


export default function AllUsers(){
    const [usersInfo, setUsersInfo] = useState({});
    const [allUsersError, setAllUsersError] = useState("");
    

    useEffect(() => {
        setAllUsersError("Loading...");
     
        fetch(process.env.REACT_APP_API+'/user/allUsers')
        .then((response) => response.json()
        .then(data => {
            if (data.success){
                if (data.message.length > 0){
                    setAllUsersError("");
                    setUsersInfo(data.message);
                }else{
                    setAllUsersError("No users present in the portal.");
                }
                
            }
            else{
                console.log(data.message);
                setAllUsersError(data.message);
            }
        }))
        .catch(err => {
            console.log(err);
            setAllUsersError("Error occured while fetching details of farmers.");
        })
    }, [])
    return(
    <>
        <div className="AllUsers">
            <h1>All Users</h1>
            <table className="usersInfo">
                <tbody>
                    <tr className="userInfo userInfoHeader">
                        <td>Profile</td>
                        <td>Username</td>
                        <td>Designation</td>
                        {/* <td>Joined at</td> */}
                    </tr>
                    {usersInfo.length>0 && usersInfo.map((user, index) => (
                        <tr className="userInfo" key={index}>
                            <td><img className="userInfoImage" src={ user.pic &&
                                    !user.pic.startsWith('http://') &&
                                    !user.pic.startsWith('https://')
                                    ? `${process.env.REACT_APP_API}/${user.pic}`
                                    : user.pic} alt="profile" />
                            </td>
                            <td className="userInfoName">{user.username}</td>
                            <td className="isAdmin">{user.isAdmin ? ("Admin") : ("Farmer")}</td>
                            {/* <td className="userInfoJoined">{user.createdAt.substr(0, 10)}</td> */}
                        </tr>
                    ))}
                </tbody>
            </table>
            {allUsersError !== "" && (
                <div id="allUsersError">{allUsersError}</div>
            )}
        </div>
    </>)
}