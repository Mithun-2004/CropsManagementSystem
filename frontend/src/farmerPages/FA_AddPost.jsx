import React from 'react';
import {useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';

export default function FA_AddPost(){
    const {id} = useParams();
    const navigate = useNavigate();
    const [postError, setPostError] = useState("");
    const [images, setImages] = useState([]);
    const [formData, setFormData] = useState({
        folderId : id,
        title: '',
        images: [],
        caption: '',
        description: ''
      });
    
      const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'images') {
          const selectedImages = Array.from(files);
          setImages(selectedImages);
          setFormData(prevState => ({
            ...prevState,
            [name]: selectedImages
          }));
        } else {
          setFormData(prevState => ({
            ...prevState,
            [name]: value
          }));
        }
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        
        const formDataObject = new FormData();
        
        for (const key in formData) {
            if (key != "images"){
              formDataObject.append(key, formData[key]);
            }
        }
        
        images.forEach((file, index) => {
          formDataObject.append('images', file);
        });


      
        const response = await fetch(process.env.REACT_APP_API+`/farmer/createPost`, {
            method: 'POST',
            body : formDataObject,
            credentials : 'include',
        })
        const data = await response.json();
        if (data.success){
            setFormData({title:"", images:[], caption:"", description:""});
            setPostError("");
            navigate(-1);
        }
        else{
            console.log(data.message);
            setPostError(data.message);
        }
      };
    
      return (
        <>
            <div className="addPost">
                <h1>Add Post</h1>
                <form onSubmit={handleSubmit} className="postForm">
                <div>
                    <label htmlFor="title">Title:</label>
                    <input
                    type="text"
                    id="title"
                    name="title"
                    placeholder="Title goes here..."
                    value={formData.title}
                    onChange={handleChange}
                    required
                    />
                </div>
                <div>
                    <label htmlFor="images">Images:</label>
                    <input
                    type="file"
                    id="images"
                    name="images"
                    multiple
                    accept="image/*"
                    onChange={handleChange}
                    required
                    />
                </div>
                <div>
                    <label htmlFor="caption">Caption:</label>
                    <input
                    type="text"
                    id="caption"
                    name="caption"
                    placeholder="Caption goes here..."
                    value={formData.caption}
                    onChange={handleChange}
                    required
                    />
                </div>
                <div>
                    <label htmlFor="description">Description:</label>
                    <textarea
                    id="description"
                    name="description"
                    placeholder="Description goes here..."
                    value={formData.description}
                    onChange={handleChange}
                    required
                    />
                </div>
                <button type="submit" id="postSubmitBtn">Submit</button>
                <p className="addPostError">{postError}</p>
                </form>
            </div>
        </>
       
      );
}