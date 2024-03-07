import React from 'react-router-dom';
import {useState, useEffect} from 'react';
import {useParams, Link, useNavigate} from 'react-router-dom';
import Model from 'react-modal';

export default function SingleFolderAdmin({}){
    const {id} = useParams();
    const [folderInfo, setFolderInfo] = useState("");
    const [folderError, setFolderError] = useState("");
    const [isDropdown1Open, setIsDropdown1Open] = useState(false);
    const [isDropdown2Open, setIsDropdown2Open] = useState(false);
    const [visible, setVisible] = useState(false);
    const [addFarmerModelError, setAddFarmerModelError] = useState("");
    const [username, setUsername] = useState("");
    const [deleteError, setDeleteError] = useState("");
    const navigate = useNavigate();
    
    useEffect(() => {
        setFolderError("Loading...");
        fetch(process.env.REACT_APP_API+`/admin/folder/${id}`, {
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

    const handleAdd = async (e) => {
        e.preventDefault();
        setAddFarmerModelError("Loading...");
        const response = await fetch(process.env.REACT_APP_API+"/admin/addFarmer", {
            method:"PUT",
            credentials:"include",
            body:JSON.stringify({folderId:id, username}),
            headers: {'Content-type':'application/json'}
        })

        const data = await response.json();
        
        if (data.success){
            setAddFarmerModelError("");
            setUsername("");
            setVisible(false);
            window.location.reload(false);
        }else{
            setAddFarmerModelError(data.message);
            console.log(data.message);
        }
    }  

    const handleDelete = async () => {
        
        const result = window.confirm("Do you want to delete the folder?");
        if (result){
            setDeleteError("Loading...")
            const response = await fetch(process.env.REACT_APP_API+"/admin/removeFolder", {
                method:"POST",
                credentials:"include",
                body:JSON.stringify({folderId:id}),
                headers:{"Content-type":"application/json"}
            })

            const data = await response.json();
            if (data.success){
                setDeleteError("");
                navigate("/admin/")
            }else{
                console.log(data.message);
                setTimeout(() => {
                    setDeleteError(data.message);
                }, 2000)
                setDeleteError("");
            }
        }
    }

    return(
        <>
            {folderInfo && (
            <div className="folder">
                <div className="folderTitles">
                    <h3><span>Region: </span>{folderInfo.folderDoc.regionName}</h3>
                    <h3><span>Crop: </span>{folderInfo.folderDoc.cropName}</h3>
                </div>
                <div className="farmers">
                <h2 className="dropDownTitle" onClick={() => setIsDropdown1Open(!isDropdown1Open)}>Farmers Assigned<span><i className="ri-expand-up-down-fill"></i></span></h2>
                {isDropdown1Open && (
                    <div className="farmerHolder">
                    {folderInfo.folderDoc.farmers.length > 0 ? (
                        folderInfo.folderDoc.farmers.map((farmer, index) => (
                        <div className="farmerItem" key={index}>
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
                    <div>
                        <button id="addFarmerBtn" onClick={() => {setAddFarmerModelError("");setUsername("");setVisible(true)}}><i className="ri-add-box-line"></i></button>
                        <Model isOpen={visible} onRequestClose={() => {setAddFarmerModelError("");setUsername("");setVisible(true)}} ariaHideApp={false} style={{
                            overlay:{
                            background:"linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75))"
                            },
                            content:{
                            color : "black",
                            maxWidth : "400px",
                            maxHeight : "200px",
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
                             <div className="addFarmerBtnWrapper"><button onClick={() => {setVisible(false)}} id="addFarmerCloseBtn"><i className="ri-close-circle-line"></i></button></div>
                            <form className="addFarmerForm">
                                <h3>Add Farmer</h3>
                                <div>
                                    <input type="text" placeholder="Enter username here" value={username} onChange={(e) => {setUsername(e.target.value)}} required/>
                                    <button id="addFarmerModelBtn" onClick={handleAdd}>Add</button>
                                </div>
                                <p id="addFarmerModelError">{addFarmerModelError}</p>
                            </form>
                        </Model>
                    </div>
                </div>
                )}
                </div>
                <div className="posts">
            <h2 className="dropDownTitle" onClick={() => setIsDropdown2Open(!isDropdown2Open)}>Posts<span><i className="ri-expand-up-down-fill"></i></span></h2>
            {isDropdown2Open && (
                <div className="postHolder">
                {folderInfo.posts.length > 0 ? (
                    folderInfo.posts.map((post, index) => (
                    <div className="postItem" key={index}>
                        <img
                        className="postImg"
                        src={`${process.env.REACT_APP_API}/${post.images[0]}`}
                        alt=""
                        />
                        <h3 className="postTitle">{post.title}</h3>
                        <p className="postAuthor">{post.createdBy.username}</p>
                        <p className="postCaption">{post.caption}</p>
                        <p className="postLink"><Link to={`/admin/post/${post._id}`}>Read More >> </Link></p>
                    </div>
                    ))
                ) : (
                    <p>No posts available.</p>
                )}
                </div>
            )}
            </div>
            <button id="deleteFolderBtn" onClick={handleDelete}>Delete Folder</button>
            <p className="deleteError">{deleteError}</p>
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