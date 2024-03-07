import React from 'react';
import {useState, useEffect} from 'react';
import {Link, useParams} from 'react-router-dom';

export default function FA_SingleFolder(){
  const {id} = useParams();
  const [folderInfo, setFolderInfo] = useState("");
  const [folderError, setFolderError] = useState("");
  const [isDropdown1Open, setIsDropdown1Open] = useState(false);
  const [isDropdown2Open, setIsDropdown2Open] = useState(false);

  useEffect(() => {
      setFolderError("Loading...");
      fetch(process.env.REACT_APP_API+`/farmer/assignedFolder/${id}`, {
          method:"GET",
          credentials:"include"
      }).then((response) => response.json()
      .then((data) => {
          if (data.success){
              setFolderInfo(data.message);
              setFolderError("");
          }else{
              setFolderError(data.message);
          }
      }))
      .catch((err) => {
          console.log(err);
          setFolderError("error occured while fetching the folder.")
      })

  }, [])

  return(
    <>
    {folderInfo && (
        <div className="folder">
            <div className="folderTitles">
                <h3><span>Region: </span>{folderInfo.folderDoc.regionName}</h3>
                <h3><span>Crop: </span>{folderInfo.folderDoc.cropName}</h3>
            </div>
            <div className="farmers">
            <h2 className="dropDownTitle  faDropDownTitle" onClick={() => setIsDropdown1Open(!isDropdown1Open)}>Farmers Assigned<span><i class="ri-expand-up-down-fill"></i></span></h2>
            {isDropdown1Open && (
                <div className="farmerHolder">
                {folderInfo.folderDoc.farmers.length > 0 ? (
                    folderInfo.folderDoc.farmers.map((farmer, index) => (
                    <div className="farmerItem faItem" key={index}>
                        <img
                        className="farmerPic"
                        alt="farmerProfile"
                        src={
                            farmer.pic &&
                            !farmer.pic.startsWith('http://') &&
                            !farmer.pic.startsWith('https://')
                            ? `${process.env.REACT_APP_API}/${farmer.pic}`
                            : farmer.pic
                        }
                        />
                        <p className="farmerName">{farmer.username}</p>
                    </div>
                    ))
                ) : (
                    <p>No farmers assigned</p>
                )}
                </div>
            )}
            </div>
            <div className="posts">
                <div className="faPostTitle">
                    <h2 className="dropDownTitle faDropDownTitle" onClick={() => setIsDropdown2Open(!isDropdown2Open)}>Posts<span><i class="ri-expand-up-down-fill"></i></span></h2>
                    <Link to={`/farmer/addPost/${folderInfo.folderDoc._id}`}>Add Post</Link>
                </div>

            {isDropdown2Open && (
                <div className="postHolder">
                {folderInfo.posts.length > 0 ? (
                    folderInfo.posts.map((post, index) => (
                    <div className="postItem faItem" key={index}>
                        <img
                        className="postImg"
                        src={`${process.env.REACT_APP_API}/${post.images[0]}`}
                        alt=""
                        />
                        <h3 className="postTitle">{post.title}</h3>
                        <p className="postAuthor faAuthor">{post.createdBy.username}</p>
                        <p className="postCaption">{post.caption}</p>
                        <p className="postLink faLink"><Link to={`/farmer/post/${post._id}`}>Read More >> </Link></p>
                    </div>
                    ))
                ) : (
                    <p>No posts available.</p>
                )}
                </div>
            )}
            </div>
            </div>
        )}

        {!folderInfo && (
            <div className="folder">
                {folderError}
            </div>
        )}
    </>
  )
}