import React from 'react';
import {useState} from 'react';
import {useNavigate} from 'react-router-dom';

export default function LoginPage({setInLoginPage}){
    const [loginUsername, setLoginUsername] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [loginError, setLoginError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoginError("Loading...");
        try{
            const response = await fetch(process.env.REACT_APP_API+"/user/login", {
              method: 'POST',
              body: JSON.stringify({username: loginUsername, password: loginPassword}),
              headers: {'Content-type' : 'application/json'},
              credentials: 'include',
            });
            const data = await response.json();
           
            if (data.success){
              localStorage.setItem("userInfo", JSON.stringify(data.message));
              setLoginError("");
              setLoginUsername("");
              setLoginPassword("");
              if (JSON.parse(localStorage.getItem("userInfo")).isAdmin){
                return navigate("/admin");
              }else{
                return navigate("/farmer");
              }
              
            }
            else{
              setLoginError(data.message);
            }
        }
        catch (err){
          console.log(err);
          setLoginError("Some error occured");
        }
    }

  return (
    <div className="loginPage entry">
      <h1>Login</h1>
      <form className="login entry-form" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="loginUsername">Username</label>
          <input type="text" placeholder="Enter Your Username" id="loginUsername" required value={loginUsername} onChange={(e) => {setLoginUsername(e.target.value)}} />
        </div>
        <div>
          <label htmlFor="loginPassword">Password</label>
          <input type="password" placeholder="Enter Your Password" id="loginPassword" required value={loginPassword} onChange={(e) => {setLoginPassword(e.target.value)}}/>
        </div>
        <div className="buttonWrapper">
          <button type="submit" id="loginBtn">Login</button>
        </div>
        <p className="loginInfo">Doesn't have an account? <button onClick={(e) => {e.preventDefault(); setInLoginPage(false)}} id="switchBtn">Register</button></p>
        <p className="loginError">{loginError}</p>
      </form>
    </div>
  )
}
