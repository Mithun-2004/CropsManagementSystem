import { Routes, Route, useNavigate } from 'react-router-dom';

import AdminDashboard from '../adminPages/AdminDashboard';
import SingleFolderAdmin from '../adminPages/SingleFolderAdmin';
import PostPage from '../adminPages/PostPage';
import AllUsers from '../adminPages/AllUsers';

import { useEffect } from 'react';

const AdminPages = () => {
  const navigate = useNavigate();

  useEffect(()=> {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!userInfo){
      navigate("/");
    }
    else if (userInfo.isAdmin === false){
      navigate("/farmer");
    }
  }, [])

  return (
    <Routes>
      <Route index element={<AdminDashboard />} />
      <Route path="/folder/:id" element={<SingleFolderAdmin />} />
      <Route path="/post/:id" element={<PostPage />} />
      <Route path="/allUsers" element={<AllUsers />} />
    </Routes>
  );
};

export default AdminPages;