import { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import service from '../../appwrite/config';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { successfully } from '../../store/authSlice'; // Removed unnecessary import

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

  useEffect(() => {
    async function fetchProfile() {
      const user_profile = await service.getProfileinfo(userDataa.$id);
      if (user_profile) {
        setProfilePic(user_profile.ProfilePic);
      }
    }
    fetchProfile();
  }, [userDataa]);

  const handleFileChange = (event) => {
    const selectedFilee = event.target.files[0];
    if (selectedFilee) {
      if (selectedFilee.type.startsWith('video/') || selectedFilee.type.startsWith('image/')) {
        setSelectedFile(selectedFilee);
      } else {
        alert('Invalid file type. Please choose a video or image file.');
      }
    }
  };

  const handlePost = async () => {
    if (selectedFile) {
      console.log("Uploading file:", selectedFile);
      try {
        setLoading(true);
        const file = await service.uploadFile(selectedFile);
        if (file) {
          const data = {
            userId: userDataa.$id,
            username: userDataa.name,
            title: note,
            ProfilePic: profilePic,
          };

          if (selectedFile.type.startsWith('image/')) {
            console.log("Uploading image...");
            data.featuredImage = file.$id;
            await service.createPost(data);
          } else if (selectedFile.type.startsWith('video/')) {
            console.log("Uploading video...");
            data.featuredVideo = file.$id;
            await service.createPost_video(data);
          }

          dispatch(successfully({ messageStatus: true, message: "Post created successfully!" }));
          navigate('/');
        }
      } catch (error) {
        console.error('Error uploading file:', error);
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
        <div className="bg-white shadow p-4 py-8">
          <div className="heading text-center font-bold text-2xl m-5 text-gray-800 bg-white">New Post</div>
          <div className="editor mx-auto w-10/12 flex flex-col text-gray-800 border border-gray-300 p-4 shadow-lg max-w-2xl">
            <input
              className="title bg-gray-100 border border-gray-300 p-2 mb-4 outline-none"
              spellCheck="false"
              onChange={(e) => setNote(e.target.value)}
              placeholder="Title"
              type="text"
            />
            {selectedFile.type.startsWith('image/') && (
              <img className="img_logo_create_after" style={{ margin: "0 auto" }} src={URL.createObjectURL(selectedFile)} alt="Selected Image" />
            )}
            {selectedFile.type.startsWith('video/') && (
              <div>
                <video controls width="470" height="200" style={{ margin: "0 auto" }}>
                  <source src={URL.createObjectURL(selectedFile)} type="video/*" />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
            <div className="icons flex text-gray-500 m-2">
              <label id="select-image">
                <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
                <svg
                  className="mr-2 cursor-pointer hover:text-gray-700 border rounded-full p-1 h-7"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                  />
                </svg>
              </label>
            </div>
            <div className="buttons flex justify-end">
              <div
                className="btn border border-indigo-500 p-1 px-4 font-semibold cursor-pointer text-gray-200 ml-2 bg-indigo-500"
                onClick={handlePost}
              >
                Post
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="create_post_main">
          <div className="create_post_box">
            <div className="create_post_main_2">
              <div className="upper_name">Create new post</div>
              <div className="bottom_name">
                <div className="bottom_post">
                  <div>
                    <FontAwesomeIcon className="img_logo_create" icon={faCamera} onClick={handleIconClick} />
                  </div>
                  <div className="drag_img">
                    <h5>Drag photos here</h5>
                  </div>
                  <div className="input_field">
                    <button className="drag_img" onClick={handleIconClick}>
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
