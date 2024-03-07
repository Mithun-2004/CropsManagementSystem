import { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

import FarmerDashboard from '../farmerPages/FarmerDashboard';
import FA_SingleFolder from '../farmerPages/FA_SingleFolder';
import FA_PostPage from '../farmerPages/FA_PostPage';
import FA_AddPost from '../farmerPages/FA_AddPost';
import AllUsers from '../farmerPages/AllUsers';

const FarmerPages = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!userInfo){
      navigate("/");
    }
    else if (userInfo.isAdmin === true){
      navigate("/admin");
    }
  }, [])
  return (
    <Routes>
      <Route index element={<FarmerDashboard />} />
      <Route path="/folder/:id" element={<FA_SingleFolder />} />
      <Route path="/post/:id" element={<FA_PostPage />} />
      <Route path="/addPost/:id" element={<FA_AddPost />} />
      <Route path="/allUsers" element={<AllUsers />} />
      {/* <Route path="profile" element={<FarmerProfile />} />
      <Route path="products" element={<FarmerProducts />} />
      Add more nested routes as needed */}
    </Routes>
  );
};

export default FarmerPages;
