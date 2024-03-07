import React from 'react';
import {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';

export default function FarmerDashboard(){
  const [folders, setFolders] = useState([]);
  const [folderError, setFolderError] = useState("");

  useEffect(() => {
    setFolderError("Loading...");
    fetch(process.env.REACT_APP_API+"/farmer/assignedFolders", {method:"GET", credentials:"include"})
    .then((response) => response.json()
    .then((data) => {
      
      if (data.success){
        if (data.message.length>0){
          setFolders(data.message);
          setFolderError("");
        }
        else{
          setFolderError("Sorry! No folders assigned.");
        }
        
      }else{
        console.log(data.message);
        setFolderError(data.message);
      }
    }))
    .catch((err) => {
      console.log(err);
      setFolderError("error occured while fetching folders.");
    })
  }, [])




  return (
    <div>
      <h1 className="dashboardHeading faDashboardHeading">Farmer Dashboard</h1>
  
      {folders.length > 0 && (
        <div className="folders">
          <h2>Assigned Folders</h2>
          <table className="folderTable faFolderTable">
            <tbody>
              <tr className="folderItemTitle faColor">
                <td>Region Name</td>
                <td>Crop Name</td>
                <td>More</td>
              </tr>
              {folders.map((folder, index) => (
                <tr className="folderItem faFolderItem" key={index}>
                  <td>{folder.regionName}</td>
                  <td>{folder.cropName}</td>
                  <td><Link to={`/farmer/folder/${folder._id}`}>View >></Link></td>
                </tr>
              ))}
            </tbody>
            
          </table>
        </div>
      )}

      {
        folderError !== "" && <h2 className="folders">{folderError}</h2>
      }
    </div>
  )
}
