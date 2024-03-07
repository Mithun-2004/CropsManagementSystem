import React from 'react';
import {useState} from 'react';
import {useNavigate} from 'react-router-dom';

export default function RegisterPage({setInLoginPage}) {
  const [registerName, setRegisterName] = useState("");
  const [image, setImage] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [registerError, setRegisterError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRegisterError("Loading...");
    if (registerPassword !== confirmPassword){
      setRegisterError("Password and Confirm Password are not same");
    }
    else{
      const info = new FormData();
      info.set('username', registerName);
      if (image !== ""){
        info.set('image', image[0]);
      }
      info.set('password', confirmPassword);
      try{
        const response = await fetch(process.env.REACT_APP_API+"/user/register", {
          method: 'POST',
          body: info,
          credentials:"include"
        })
        const data = await response.json();
        console.log(data);
        if (data.success){
          localStorage.setItem("userInfo", JSON.stringify(data.message));
          setRegisterName("");
          setRegisterPassword("");
          setConfirmPassword("");
          setImage("");
          setRegisterError("");
          if (data.message.isAdmin){
            navigate("/admin");
          }else{
            navigate("/farmer");
          }
        }else{
          setRegisterError(data.message);
        }
      }
      catch (err){
        console.log(err);
        setRegisterError("Some error occured.");
      }
     }
    
  }

  return (
    <div className="register entry">
      <h1>Register</h1>
      <form className="register entry-form" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="registerName">Username</label>
          <input type="text" placeholder="Enter your Name" id="registerName" required value={registerName} onChange={(e) => {setRegisterName(e.target.value)}} />
        </div>
        <div>
          <label htmlFor="RegisterPassword">Password</label>
          <input type="password" placeholder="Enter your Password" id="registerPassword" required value={registerPassword} onChange={(e) => {setRegisterPassword(e.target.value)}} />
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input type="password" placeholder="Confirm your Password" id="confirmPassword" required value={confirmPassword} onChange={(e) => {setConfirmPassword(e.target.value)}} />
        </div>
        <div>
          <label htmlFor="registerPicture" className="upload-label">Upload your Picture</label>
          <input type="file" id="registerPicture" accept="image/*" onChange={e => setImage(e.target.files)}/>
        </div>
        <div className="buttonWrapper">
          <button type="submit" id="registerBtn">Register</button>
        </div>
        <p className="registerInfo">Already have an account? <button onClick={(e) => {e.preventDefault(); setInLoginPage(true)}} id="switchBtn">Login</button></p>
        <p className="registerError">{registerError}</p>
      </form>
    </div>
  )
}
