// import React from 'react';
// import {useState, useEffect} from 'react';
// import {useNavigate} from 'react-router-dom';

// export default function Header(){
//     const [username, setUsername] = useState("");
//     const [pic, setPic] = useState("");
//     const [designation, setDesignation] = useState("");
//     const navigate = useNavigate();

//     useEffect(() => {
//         const userInfo = JSON.parse(localStorage.getItem("userInfo"));
//         if (userInfo){
//             setUsername(userInfo.username);
//             if (userInfo.pic && !userInfo.pic.startsWith("http://") && !userInfo.pic.startsWith("https://")) {
//                 setPic(process.env.REACT_APP_API+userInfo.pic);
//             } else {
//                 setPic(userInfo.pic);
//             }
            
//             setDesignation(userInfo.isAdmin ? "Admin" : "Farmer");

//         }else{
//             navigate("/");
//         }
//     }, [])

//     const logout = async (e) => {
//         e.preventDefault();
//         const response = await fetch(process.env.REACT_APP_API+"/user/logout", {
//             method:"POST",
//             credentials:"include",
//         })
//         const data = await response.json();
//         if (data.success){
//             localStorage.removeItem("userInfo");
//             setUsername("");
//             setPic("");
//             setDesignation("");
//             navigate("/");
//         }else{
//             alert(data.message);
//         }
//     }

//     return(
//         <div className="header">
//             <h3>CropsMangementSystem</h3>
//             <div className="userInfo">
//                 <div>
//                     <img src={pic} alt="profile-pic" className="profilePic"/>
//                     <p id="username">{username}</p>
//                     <p id="designation">{designation}</p>
//                     <button onClick={logout} id="logoutBtn">Logout</button>
//                 </div>
//             </div>
//         </div>
//     )
// }


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Model from 'react-modal';


export default function Header() {
  const [username, setUsername] = useState("");
  const [pic, setPic] = useState("");
  const [designation, setDesignation] = useState("");
  const [visible, setVisible] = useState(false);
  const [image, setImage] = useState("");
  const [showRemove, setShowRemove] = useState(false);
  const [remove, setRemove] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    
    if (userInfo) {
      setUsername(userInfo.username);
      if (userInfo.pic && !userInfo.pic.startsWith("http://") && !userInfo.pic.startsWith("https://")) {
        setPic(process.env.REACT_APP_API + "/" + userInfo.pic);
        setShowRemove(true);
      } else {
        setPic(userInfo.pic);
        setShowRemove(false);
      }
      setDesignation(userInfo.isAdmin ? "Admin" : "Farmer");
    } else {
      navigate("/");
    }
  }, []);

  const logout = async (e) => {
    e.preventDefault();
    const response = await fetch(process.env.REACT_APP_API + "/user/logout", {
      method: "POST",
      credentials: "include",
    });
    const data = await response.json();
    if (data.success) {
      localStorage.removeItem("userInfo");
      setUsername("");
      setPic("");
      setDesignation("");
      navigate("/");
    } else {
      alert(data.message);
    }
  }

  const handleChangePic = async () => {
      if (image === ""){
        return;
      }
      const info = new FormData();
      info.set('remove', "no");
      info.set('username', username);
      info.set('image', image[0]);
      
      const response = await fetch(process.env.REACT_APP_API+"/user/changeProfilePic", {
        method:"PUT",
        credentials:"include",
        body: info
      })
      
      const data = await response.json();
      if (data.success){
        localStorage.setItem("userInfo", JSON.stringify(data.message));
        window.location.reload(false);
      }else{
        console.log(data.message);
      }
    
    setImage("");
  }

  const handleRemovePic = async () => {
    const info = new FormData();
      info.set('remove', "yes");
      info.set('username', username);
      const response = await fetch(process.env.REACT_APP_API+"/user/changeProfilePic", {
        method:"PUT",
        credentials:"include",
        body: info
      })
      const data = await response.json();
      if (data.success){
        localStorage.setItem("userInfo", JSON.stringify(data.message));
        window.location.reload(false);
      }else{
        console.log(data.message);
      }
      setImage("");
  }

  return (
    <div className="header">
      <h3 id="headerHeading">Crop<span>Sys</span></h3>
      <div className="userInfo">
        <div className="userProfile">
          <button onClick={() => {setVisible(true)}} id="headerBtn"><img src={pic} alt="profile-pic" className={ designation==="Admin" ? "profileAdminPic" : "profileFarmerPic"} /></button>
          <Model isOpen={visible} onRequestClose={() => {setVisible(false);}} ariaHideApp={false} id="addFolderModel" style={{
            overlay:{
              background:"linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75))"
            },
            content:{
              maxWidth : "400px",
              maxHeight : "330px",
              width : "90%",
              height : "90%",
              top: '50%',
              left: '50%',
              right: 'auto',
              bottom: 'auto',
              marginRight: '-50%',
              transform: 'translate(-50%, -50%)',
            }
          }}>
            <div className="detailsCloseBtnWrapper"><button id="detailsCloseBtn" onClick={() => {setVisible(false)}}><i className="ri-close-circle-line"></i></button></div>
            <div className="userDetails">
              <h3>User Details</h3>
              <div><img src={pic} alt="profile-pic" className="userDetailsPic" /></div>
              <div>
                {showRemove && (<button id="removePicBtn" onClick={handleRemovePic}>Remove Pic</button>)}
              </div>
              <p className="detailsUsername">{username}</p>
              <p className="detailsDesignation">{designation}</p>
              <div>
              <div className="updateProfilePic">
                <label htmlFor="updatePicture" className="updateLabel">{image==="" ? "Change Pic" : `${image[0].name}`}</label>
                <button id="changePicBtn" onClick={handleChangePic}><i className="ri-check-fill"></i></button>
                <div><input type="file" id="updatePicture" accept="image/*" onChange={e => setImage(e.target.files)}/></div>
                
              </div>
              </div>
            </div>
            </Model>
          </div>
        
        <button onClick={logout} id="logoutBtn">Logout</button>
      </div>
    </div>
  )
}
