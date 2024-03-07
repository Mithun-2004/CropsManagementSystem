import React from 'react';
import {useState, useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import Model from 'react-modal';

export default function AdminDashboard(){
  const [folders, setFolders] = useState([]);
  const [folderError, setFolderError] = useState("");
  const [searchType, setSearchType] = useState('region');
  const [searchValue, setSearchValue] = useState(""); 
  const [foldersName, setFoldersName] = useState("All folders");
  const [visible, setVisible] = useState(false);
  const [regionName, setRegionName] = useState("");
  const [cropName, setCropName] = useState("");
  const [modelError, setModelError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setFolderError("Loading...");
    fetch(process.env.REACT_APP_API+"/admin/folders", {method:"GET", credentials:"include"})
    .then((response) => response.json()
    .then((data) => {
      if (data.success){
        setFolders(data.message);
        setFolderError("");
      }else{
        setFolderError(data.message);
      }
    }))
    .catch((err) => {
      console.log(err);
      setFolderError("error occured while fetching folders.");
    })
  }, [])

  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
  };

  const handleSearch = async () => {
    setFolders([]);
    setFolderError("Loading...");

    const response = await fetch(`${process.env.REACT_APP_API}/admin/folders?${searchType}Name=${searchValue}`, {
      method: "GET",
      credentials: "include"
    });

    const data = await response.json();
    if (data.success) {
      setFolders(data.message);
      setFolderError("");
      if (searchValue === "") {
        setFoldersName("All folders");
      } else {
        setFoldersName(`${searchType}: ${searchValue}`);
      }
    } else {
      console.log(data.message);
      setFolders([]);
      setFolderError(`No folders available with ${searchType}: ${searchValue}`);
      setFoldersName("");
    }
    setSearchValue(""); // Reset search value after handling the response
  };

  const handleCreate = async (e) => {
    setModelError("Loading...");
    e.preventDefault();
    const response = await fetch(process.env.REACT_APP_API+"/admin/createFolder", {
      method:"POST",
      credentials:"include",
      body:JSON.stringify({regionName, cropName}),
      headers:{'Content-type':'application/json'}
    })

    const data = await response.json();
    if (data.success){
      setModelError("");
      setRegionName("");
      setCropName("");
      setVisible(false);
      navigate("/admin/folder/"+data.message._id);
    }else{
      setModelError(data.message);
      console.log(data.message);
    }
  }

  return (
    <div>
      <div className="dashboardHeader">
        <h1 className="dashboardHeading">Admin Dashboard</h1>
        <div className="dashboardSearch">
          <div className="dashboardInput"><input
            type="text"
            placeholder={`Enter ${searchType === 'region' ? 'Region' : 'Crop'} Name`}
           className="dashboardSearch" value={searchValue} onChange={e => setSearchValue(e.target.value)}/>
           <select value={searchType} onChange={handleSearchTypeChange}>
            <option value="region">Search by Region Name</option>
            <option value="crop">Search by Crop Name</option>
          </select>
          </div>
          <button className="dashboardSearchBtn" onClick={handleSearch}>Search</button>
        </div>
      </div>
      <div className="folderTitleAdd">
        <h1>Folders</h1>
        <div>
          <button id="addFolderBtn" onClick = {() => {setVisible(true)}}>Add Folder</button>
          <Model isOpen={visible} onRequestClose={() => {setModelError("");setRegionName("");setCropName("");setVisible(false);}} ariaHideApp={false} id="addFolderModel" style={{
            overlay:{
              background:"linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75))"
            },
            content:{
              maxWidth : "400px",
              maxHeight : "300px",
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
            <div className="addFolderBtnWrapper"><button onClick={() => {setModelError("");setRegionName("");setCropName("");setVisible(false);}} id="addFolderCloseBtn"><i className="ri-close-circle-line"></i></button></div>
            <form className="addFolderForm">
              <h3>Add Folder</h3>
              <div>
              <input type="text" id="addRegionName" placeholder="Enter region name" value={regionName} onChange={(e) => {setRegionName(e.target.value)}} required/>
              </div>
              <div>
              <input type="text" id="addCropName" placeholder="Enter crop name" value={cropName} onChange={(e) => {setCropName(e.target.value)}} required/>
              </div>
              <div>
                <button id="createFolderBtn" onClick={handleCreate}>Create</button>
              </div>
              <p className="dashboardModelError">{modelError}</p>
            </form>
          </Model>
        </div>
        
      </div>
      {folders.length > 0 && (
        <div className="folders">
          <h2>{foldersName === "All folders" ? `${foldersName}` : `Showing results for ${foldersName}`}</h2>
          <table className="folderTable">
            <tbody>
              <tr className="folderItemTitle">
                <td>Region Name</td>
                <td>Crop Name</td>
                <td>More</td>
              </tr>
              {folders.map((folder, index) => (
                <tr className="folderItem" key={index}>
                  <td>{folder.regionName}</td>
                  <td>{folder.cropName}</td>
                  <td><Link to={`/admin/folder/${folder._id}`}>View >></Link></td>
                </tr>
              ))}
            </tbody>
            
          </table>
        </div>
      )}

      {
        folders.length <= 0 && <h2 className="folders">{folderError}</h2>
      }
    </div>
  )
}
