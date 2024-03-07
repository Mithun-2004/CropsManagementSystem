import React from 'react';
import {useState, useEffect} from 'react';
import {useParams, useNavigate} from 'react-router-dom';

export default function FA_PostPage(){
  const {id} = useParams();
  const [postInfo, setPostInfo] = useState();
  const [postError, setPostError] = useState("");
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const navigate = useNavigate();

  const deletePost = async (postId) => {
    const result = window.confirm("Do you want to delete the post?");
    if (result){
        setPostError("Deleting post...");
        const response = await fetch(process.env.REACT_APP_API+'/farmer/removePost', {
            method:'POST',
            body:JSON.stringify({postId: postId}),
            headers: {'Content-type' : 'application/json'},
            credentials:"include",
        })

        const data = await response.json();
        if (data.success){
            setPostError("");
            navigate(-1);
        }else{
            console.log(data.message);
            setPostError(data.message);
        }
    }
  }

  useEffect(()=>{
      setPostError("Loading...");
      fetch(process.env.REACT_APP_API+`/farmer/post/${id}`, {
          method:"GET",
          credentials:"include"
      })
      .then((response) => response.json()
      .then((data) => {
          if (data.success){
              
              setPostInfo(data.message);
              setPostError("");
          }else{
              setPostError(data.message);
          }
      }))
      .catch((err) => {
          console.log(err);
          setPostError("error occured while fetching the post.")
      })
  }, [])

  return(
      <>
      {postInfo && (
          <div className="singlePost">
              <h1 className="singlePostTitle">{postInfo.title}</h1>
              <p className="singlePostAuthor faPostColor">Posted by: <span className="faColor">{postInfo.createdBy.username}</span></p>
                <p className="singlePostDate faPostColor">Posted at: <span className="faColor">{postInfo.createdAt.substr(0,10)}</span></p>
              <div className="singlePostImages">
                  {postInfo.images.map((image, index) => {return(
                      <img src={`${process.env.REACT_APP_API}/${image}`} className="singlePostImage" alt={"postImage"+index} key={index}/>
                  )})}
              </div>
              <h3 className="singlePostCaption faColor">{postInfo.caption}</h3>
              <p className="singlePostDescription">{postInfo.description}</p>
              {userInfo.id === postInfo.createdBy._id && (
                <button id="deleteBtn" onClick={() => {deletePost(postInfo._id)}}>Delete Post</button>
              )}
              <p></p>
          </div>
      )}
      {/* {!postInfo && ( */}
          <div className="singlePost" id="postError">
              {postError}
          </div>
      {/* )} */}
      </>
  )
}