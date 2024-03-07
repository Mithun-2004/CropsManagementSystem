import LoginPage from '../authPages/LoginPage';
import RegisterPage from '../authPages/RegisterPage';

import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';

const IndexPage = () => {
    const [inLoginPage, setInLoginPage] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        if (userInfo){
            console.log(userInfo.isAdmin)
            if (userInfo.isAdmin){
                navigate("/admin");
            }else{
                navigate("/farmer");
            }
        }
      }, [])
    return ( 
        <div className="IndexPage">
            <h1 id="title">Crops Management system</h1>
            <div className="enter">
                {inLoginPage && (<LoginPage setInLoginPage={setInLoginPage}/>)}
                {!inLoginPage && (<RegisterPage setInLoginPage={setInLoginPage}/>)}
            </div>
        </div>
     );
}
 
export default IndexPage;