import React from 'react';
import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';

export default function PostPage(){
    const {id} = useParams();
    const [postInfo, setPostInfo] = useState();
    const [postError, setPostError] = useState("");
    useEffect(()=>{
        setPostError("Loading...");
        fetch(process.env.REACT_APP_API+`/admin/post/${id}`, {
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
                <p className="singlePostAuthor">Posted by: <span>{postInfo.createdBy.username}</span></p>
                <p className="singlePostDate">Posted at: <span>{postInfo.createdAt.substr(0,10)}</span></p>
                <div className="singlePostImages">
                    {postInfo.images.map((image, index) => {return(
                        <img src={`${process.env.REACT_APP_API}/${image}`} className="singlePostImage"alt={"postImage"+index} key={index}/>
                    )})}
                </div>
                <h3 className="singlePostCaption">{postInfo.caption}</h3>
                <p className="singlePostDescription">{postInfo.description}</p>
                <p></p>
            </div>
        )}
        {!postInfo && (
            <div className="singlePost">
                {postError}
            </div>
        )}
        </>
    )
}