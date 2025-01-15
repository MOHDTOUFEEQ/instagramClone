import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import service from '../../appwrite/config';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { notInitialized } from 'react-redux/es/utils/useSyncExternalStore';
import { successfully } from '../../store/authSlice';
import authService from '../../appwrite/auth';
function Postform1() {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [note, setNote] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userDataa = useSelector((state) => state.auth.userData);

  const handleIconClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  useEffect(()=>{
    async function profile(params) {
      const user_profile = await service.getProfileinfo(userDataa.$id);
      if (user_profile) {
        setProfilePic(user_profile.ProfilePic)
      }
    }
    profile()
  },[])
  const handleFileChange = async (event) => {
    const selectedFilee = event.target.files[0];
    if (selectedFilee) {
      if (selectedFilee.type.startsWith('video/')) {
        setSelectedFile(null)
        console.log("Selected video:", selectedFilee);
        setSelectedFile(selectedFilee);
        console.log("Selected video:", selectedFilee);
        console.error("Video element error:", event.target.error);
        
      } else if (selectedFilee.type.startsWith('image/')) {
        setSelectedFile(null)
        setSelectedFile(selectedFilee);
      } else {
        alert('Invalid file type. Please choose a video or image file.');
      }
    }
    console.log("this is the final scr output");
  };

  const handlePost = async () => {
    if (selectedFile) {
      console.log("I am going to upload", selectedFile);
      try {
        setLoading(true);
        const file = await service.uploadFile(selectedFile);
        if (file) {
          const data= {}
          console.log(userDataa);
          data.userId = userDataa.$id
          data.username = userDataa.name
          data.title = note
          data.ProfilePic = profilePic
          let response = notInitialized;
          if (selectedFile.type.startsWith('image/')) {
            console.log("it is uploading img ");
            data.featuredImage = file.$id
            response =  await service.createPost({ ...data });
          }else{
            console.log("i am going to upload video and the data is", data);
            data.featuredVideo = file.$id
            response =  await service.createPost_video({ ...data });
          }
          if (response) {
            console.log("Post created successfully!");
            dispatch(successfully({ messageStatus: true, message: "Post created successfully!" }));
            console.log("SUCCESSFULLY UPDATED IN THE AUTHSLICE2 SECTION");
            navigate('/');
          }
          // Optionally, navigate to another page after successful post creation
          // navigate('/success-page');
        }
      } catch (error) {
        console.error('Error uploading image:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="bg-white shadow p-8 rounded-md custom-margin">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Creating New Post</h2>
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-500"></div>
            </div>
            <p className="mt-4 text-gray-600">Please wait while we create your post.</p>
          </div>
        </div>
      );
      
    } else if (selectedFile) {
      return (
        <>    
        <div class="bg-white shadow p-4 py-8" >
                <div class="heading text-center font-bold text-2xl m-5 text-gray-800 bg-white">New Post</div>
                <div class="editor mx-auto w-10/12 flex flex-col text-gray-800 border border-gray-300 p-4 shadow-lg max-w-2xl">
                    <input class="title bg-gray-100 border border-gray-300 p-2 mb-4 outline-none" spellcheck="false" onChange={(e) => setNote(e.target.value)} placeholder="Title" type="text" />
                    {selectedFile && selectedFile.type.startsWith('image/') && <img className='img_logo_create_after' style={{margin: "0 auto"}} src={URL.createObjectURL(selectedFile)} alt="Selected Image" />}
                            {selectedFile && selectedFile.type.startsWith('video/') && (
                                <div>
                                  <video controls width="470" height="200"  style={{margin: "0 auto"}} >
                                    <source src="https://cloud.appwrite.io/v1/storage/buckets/65592135222b614aec92/files/65aefa40ec40224e08a4/view?project=65591e5199e6a419cfa1" type="video/*" />
                                    Your browser does not support the video tag.
                                  </video>
                                </div>
                              )}

                    <div class="icons flex text-gray-500 m-2"  >
                  <label id="select-image"  >
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
                      <svg class="mr-2 cursor-pointer hover:text-gray-700 border rounded-full p-1 h-7"  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>


                  </label>
              </div>

                <div class="buttons flex justify-end">
                    <div class="btn border border-indigo-500 p-1 px-4 font-semibold cursor-pointer text-gray-200 ml-2 bg-indigo-500" onClick={handlePost} >Post</div>
                </div>
            </div>
        </div>
        </>
      );
    } else {
      return (
        <div className='create_post_main'>
          <div className='create_post_box'>
            <div className='create_post_main_2'>
              <div className="upper_name">Create new post</div>
              <div className="bottom_name">
                <div className='bottom_post'>
                  <div>
                    {/* Show the selected image if available */}
                    <FontAwesomeIcon className='img_logo_create' icon={faCamera} onClick={handleIconClick} />
                  </div>
                  <div className='drag_img'>
                    <h5>Drag photos here</h5>
                  </div>
                  <div className='input_field'>
                    <button className='drag_img' onClick={handleIconClick}>
                      Choose from Device
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      );
    }
  };

  return renderContent();
}

export default Postform1;






