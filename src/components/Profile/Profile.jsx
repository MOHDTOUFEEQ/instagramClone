import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Allblogs from '../Allblogs';
import { useForm } from 'react-hook-form';
import service from '../../appwrite/config';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Tagged_post from '../tagged/Tagged_post';
import service2 from '../../appwrite/config2';
import { faBookmark, faL } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { faMeh } from '@fortawesome/free-solid-svg-icons';
import { successfully } from '../../store/authSlice';

function Profile() {
  const { userData } = useSelector((state) => state.auth);
  const [editProfile,setEditProfile] = useState(false)
  const [profileInfo, setProfileInfo] = useState({});
  const [posts, setPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [showTagged, setShowTagged] = useState(true);
  const [showFollowers, setShowFollowers ] = useState(false);
  const [followersInfo, setFollowersInfo] = useState([]);
  const [showFollowing, setShowFollowing ] = useState(false);
  const [followingInfo, setFollowingInfo] = useState([]);
  const [filterFollowing, setFilterFollowing ] = useState("")
  const [filterFollowing_mis, setFilterFollowing_mis ] = useState("")
  const [filteredFollowing, setFilteredFollowing ] = useState("")
  const [filteredFollowing_mis, setFilteredFollowingg_mis ] = useState("")
  const [loading, setLoading] = useState(false);
  
  const [showMessage, setShowMessage] = useState(false);
  const [currId, setCurrID] = useState("");
  const [showDelete, setShowDelete] = useState(false);
  const handleShowDelete = (e)=>{
    setShowDelete((val)=>!val);
    setCurrID(e)
    console.log("parent is getting call");
  }
  const message1 = useSelector((state) => state.auth.message);
  useEffect(() => {
    console.log("I am the changed value in state", message1);
    setShowMessage(true);

    const timeoutId = setTimeout(() => {
      setShowMessage(false);
    }, 4000);

    return () => clearTimeout(timeoutId);
  }, [message1]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("i am userdata in profile", userData);
        const [profileResponse, postsResponse, ] = await Promise.all([
          service.getProfileinfo(userData.$id),
          service.getPostsForCurrentUser(userData.$id)
        ]);

        if (profileResponse) {
          console.log("here is the profile respone", profileResponse);
          setProfileInfo(profileResponse);
        }

        if (postsResponse) {
          setPosts(postsResponse.documents);
        }

        // if (savedPostsResponse) {
        //   setSavedPosts(savedPostsResponse.articles);
        // }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const onSubmit = async (data) => {
    try {
      if (data) {
        console.log("printed");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("Please don't use any commas, colons, or special characters in the title. Updates coming soon!");
    }
  };

  const closing_edit = ()=>{
    setEditProfile(false)
    document.querySelector("body").style.backgroundColor = "";
    document.querySelector(".hiddeeeen").style.filter = "blur(0px)";
  }
  const Iamclicking = () => {
    console.log("hey");
    setEditProfile((data) => !data);
    if (!editProfile) {
      document.querySelector(".hiddeeeen").style.filter = "blur(3px)";
    } else {
      document.querySelector(".hiddeeeen").style.filter = "blur(0px)";
      console.log("Editing profile is now disabled");
    }
  };
  const handleFileUpload =  (data)=>{
    async function uploadingprodile () {
      if (profileInfo.ProfilePic) {
        await service.deleteFile(profileInfo.ProfilePic)
        console.log("deleted");
      }
      console.log("submited");
      const file  = data.target.files[0];
      const success_uploaded = await service.uploadFile(file)
      if (success_uploaded) {
        const profile_pic_id = success_uploaded.$id
        const updating_profile  = await service2.updateProfilePic(userData.$id, {ProfilePic: profile_pic_id})
        console.log("updating profile",updating_profile);
        console.log("this is the success copy");
        console.log("uploaded successfully");
        if (updating_profile) {
          window.location.reload();
        }
      }
    }

    uploadingprodile()
  }
  const viewfollowers = async () => {
    try {
      console.log("hii");
      document.querySelector(".hiddeeeen").style.filter = "blur(3px)";
      setShowFollowers((val) => !val);
      if (!showFollowers) {
      } else {
        console.log("Editing profile is now disabled");
      }
      const followers_list = profileInfo.followersList;
      console.log(followers_list);
  
      // Create an array to store the user information for each follower
      const followersInfo = [];
  
      // Iterate over each follower
      for (const followerId of followers_list) {
        // Make a request to get user information for each follower
        const userPosts = await service2.getPostsForCurrentUserr(followerId);
  
        // Assuming the user information is present in userPosts.documents
        // Adjust the code based on the actual structure of your response
        const userInfo = userPosts.documents[0]; // Assuming you only expect one document
  
        // Add the user information to the followersInfo array
        followersInfo.push({
          userId: followerId,
          username: userInfo.userName,
          profilePic: userInfo.ProfilePic,
          // Add other properties as needed
        });
      }
  
      // Now, followersInfo contains an array of user information for each follower
      console.log(followersInfo);
      setFollowersInfo(followersInfo);
    } catch (error) {
      console.error("Error in viewfollowers", error);
      // Handle the error appropriately, e.g., show a message to the user
    }
  };
 
  
  const closeFollowers = ()=>{
  
    setShowFollowers((val)=> !val)
    
    document.querySelector("body").style.backgroundColor = "";
    document.querySelector(".hiddeeeen").style.filter = "blur(0px)";
  }
  const viewfollowing = async () => {
    try {
      console.log("hii");
      document.querySelector(".hiddeeeen").style.filter = "blur(3px)";
      setShowFollowing((val) => !val);
  
      // Check if followersInfo already has data, no need to make a request again
      if (followingInfo.length > 0) {
        return;
      }
  
      const followers_list = profileInfo.followingList;
      console.log(followers_list);
  
      // Create an array to store the user information for each follower
      const followersInfo = [];
  
      // Iterate over each follower
      for (const followerId of followers_list) {
        // Make a request to get user information for each follower
        const userPosts = await service2.getPostsForCurrentUserr(followerId);
  
        // Assuming the user information is present in userPosts.documents
        // Adjust the code based on the actual structure of your response
        const userInfo = userPosts.documents[0]; // Assuming you only expect one document
  
        // Add the user information to the followersInfo array
        followersInfo.push({
          userId: followerId,
          username: userInfo.userName,
          profilePic: userInfo.ProfilePic,
          // Add other properties as needed
        });
      }
      setFollowingInfo(followersInfo)
      // Now, followersInfo contains an array of user information for each follower
      console.log("i am empty", followersInfo);
      
    } catch (error) {
      console.error("Error in viewfollowing", error);
      // Handle the error appropriately, e.g., show a message to the user
    }
  };
  
 useEffect(()=>{
  console.log(" i am followingInfo", followingInfo);
 },[followingInfo])
  
  const closeFollowing = ()=>{
  
    setShowFollowing((val)=> !val)
    
    document.querySelector("body").style.backgroundColor = "";
    document.querySelector(".hiddeeeen").style.filter = "blur(0px)";
  }
  
  const closingfollowing = (e) => {
    console.log(e.target);
  
    // Check if the click event target has the class name "followers_box"
    if (e.target.classList.contains('followers_box')) {
      setShowFollowing((val)=> !val)
      
      document.querySelector("body").style.backgroundColor = "";
      document.querySelector(".hiddeeeen").style.filter = "blur(0px)";
    } else {
      console.log("The click event occurred inside 'followers_box'");
    }
  };
  const closingfollowers  = (e) => {
    console.log(e.target);
  
    // Check if the click event target has the class name "followers_box"
    if (e.target.classList.contains('followers_box')) {
      setShowFollowers((val)=> !val)
      
      document.querySelector("body").style.backgroundColor = "";
      document.querySelector(".hiddeeeen").style.filter = "blur(0px)";
    } else {
      console.log("The click event occurred inside 'followers_box'");
    }
  };
  
  useEffect(()=>{
    console.log(filterFollowing);
    console.log(followingInfo);
    if (filterFollowing.length !== 0) {

      const filteredFollowers = followersInfo.filter((e) => e.username && e.username.startsWith(filterFollowing));
      setFilteredFollowing(filteredFollowers)
      console.log("filteredFollowers", filteredFollowing);
      console.log("totalfollowing", followersInfo);
    }
    if (filterFollowing.length == 0) {
      setFilteredFollowing([])
    }
    if (filterFollowing_mis.length !== 0) {

      const filteredFollowers = followingInfo.filter((e) => e.username && e.username.startsWith(filterFollowing_mis));
      setFilteredFollowingg_mis(filteredFollowers)
      console.log("filteredFollowers", filteredFollowing);
      console.log("totalfollowing", followersInfo);
    }
    if (filterFollowing_mis.length == 0) {
      setFilteredFollowingg_mis([])
    }
  },[setFilterFollowing,filterFollowing,filterFollowing_mis,setFilterFollowing_mis])


  const removeFollower = async (userId) => {
    console.log(userId);
    
    // Filter out the follower with the given userId

    const updatedFollowersInfo = followersInfo.filter(follower => follower.userId !== userId);
    
    console.log("I am updated followers info", updatedFollowersInfo);
    
    // Update the followers count
    profileInfo.Followers = profileInfo.Followers - 1;
    
    // Extract only userIds from the updatedFollowersInfo array
    const userIdsOnly = updatedFollowersInfo.map(follower => follower.userId);
    console.log("onkly userIDssss ", userIdsOnly);
    // Call the service2.updateFollowers with only the necessary data
    const update_followers = await service2.updateFollowers(userData.$id, {
      Followers: profileInfo.Followers,
      followersList: userIdsOnly,
    });
  
    if (update_followers) {
      console.log(update_followers);
      console.log("remove follower done");
    }
  
    // Update the state with the modified array
    setFollowersInfo(updatedFollowersInfo);
  };
  const removeFollowing = async (userId) => {
    console.log(userId);
    
    // Filter out the follower with the given userId

    const updatedFollowingListInfo = followingInfo.filter(follower => follower.userId !== userId);
    
    console.log("I am updated followers info", updatedFollowingListInfo);
    
    // Update the followers count
    profileInfo.Following = profileInfo.Following - 1;
    
    // Extract only userIds from the updatedFollowersInfo array
    const userIdsOnly = updatedFollowingListInfo.map(follower => follower.userId);
    console.log("onkly userIDssss ", userIdsOnly);
    // Call the service2.updateFollowers with only the necessary data
    const update_followers = await service2.updateFollowing(userData.$id, {
      Following: profileInfo.Following,
      followingList: userIdsOnly,
    });
  
    if (update_followers) {
      console.log(update_followers);
      console.log("remove following done");
    }
  
    // Update the state with the modified array
    setFollowingInfo(updatedFollowingListInfo);
  };
  
  const closingShowDelete =()=>{
    setShowDelete(false)
  }

  const dispatch = useDispatch()
  const deletePost = () => {
    setLoading(true)
    async function deletePostInternal() {
      if (currId) {
        const deleted = await service.deletePost(currId);
        if (deleted) {
          dispatch(successfully({ messageStatus: true, message: "Post deleted successfully!" }));
          setLoading(false)
          window.location.reload();
        }
        
      }

    }
  
    deletePostInternal();
  };
  

      
  return (
    <>
    {
      
    }
      <main className="hiddeeeen bg-gray-100 bg-opacity-25  max-w-custom">
        <div className="lg:w-8/12 lg:mx-auto mb-8">
        <div className="mb-4">
          {showMessage && message1?.length > 7 && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{message1}</span>
              <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
              
              </span>
            </div>
          )}
        </div>
          <header className="flex flex-wrap items-center p-4 md:py-8">

          <div className="md:w-3/12 md:ml-16">
          <img
            onClick={Iamclicking}
            className="w-20 h-20 md:w-40 md:h-40 object-cover rounded-full border-2 border-pink-600 p-1 cursor-pointer"
            src={profileInfo.ProfilePic ? service.getFilePreview(profileInfo.ProfilePic) : "https://cdn.icon-icons.com/icons2/2468/PNG/512/user_icon_149329.png"}
            alt="profile"
          />
        </div>

            <div className="w-8/12 md:w-7/12 ml-4">
              <div className="md:flex md:flex-wrap md:items-center mb-4">
                <div>

                <h2 className="text-3xl inline-block font-light md:mr-2 mb-2 sm:mb-0" style={{width:"20%"}}>
                  {profileInfo? profileInfo.userName: null}
                </h2>
                </div>
                <Link to="/editProfile" style={{position: "relative", left: "4px", fontWeight : "800",width: "50%"}}>
                  <button className='editButton'>Edit Profile</button>
                </Link>
                <span className="inline-block fas fa-certificate fa-lg text-blue-500 
                                relative mr-6 text-xl transform -translate-y-2" aria-hidden="true">
                  <i className="fas fa-check text-white text-xs absolute inset-x-0
                                ml-1 mt-px"></i>
                </span>

               
              </div>

              <ul className="hidden md:flex space-x-8 mb-4">
                <li>
                  <span className="font-semibold">{posts ? posts.length : 0} </span>
                  posts
                </li>

                <li className='cursor-pointer' onClick={viewfollowers}>
                  <span className="font-semibold">{profileInfo ? profileInfo.Followers : 0} </span>
                  followers
                </li>
                <li  onClick={viewfollowing} className='cursor-pointer'>
                  <span className="font-semibold">{profileInfo ? profileInfo.Following : 0} </span>
                  following
                </li>
              </ul>

              <div className="hidden md:block">
              {profileInfo && profileInfo.Bio !== null && (
                  <>
                      <p>{profileInfo.Bio}</p>
                  </>
              )}
              </div>

            </div>

            <div className="md:hidden text-sm my-2">
            {profileInfo && profileInfo.Bio !== null && (
                  <>
                      <p>{profileInfo.Bio}</p>
                  </>
              )}
            </div>

          </header>

          <div className="px-px md:px-3">
              
            <ul className="flex md:hidden justify-around space-x-8 border-t 
                  text-center p-2 text-gray-600 leading-snug text-sm">
              <li>
                <span className="font-semibold text-gray-800 block">{posts ? posts.length : 0}</span>
                posts
              </li>

              <li>
                <span className="font-semibold text-gray-800 block"  onClick={viewfollowers}>{profileInfo ? profileInfo.Followers : 0}</span>
                followers
              </li>
              <li>
                <span className="font-semibold text-gray-800 block"  onClick={viewfollowing}>{profileInfo ? profileInfo.Following : 0}</span>
                following
              </li>
            </ul>
            <div>
            </div>
            <div className="px-px md:px-3">
            {/* ... (existing code) */}
           
            <ul className="flex items-center justify-around md:justify-center space-x-12  
                      uppercase tracking-widest font-semibold text-xs text-gray-600
                      border-t">
              <li className={` ${showTagged ? "md:border-t" : ""} cursor-pointer md:border-gray-700 md:-mt-px md:text-gray-700`}>
                <a
                  className="inline-block p-3"
                  onClick={(e) => { setShowTagged(true) }}
                >
                
                <i className=" fas fa-th-large text-xl md:hidden  xl:hidden lg:hidden"><FontAwesomeIcon icon={faCamera} className="text-xl" /></i>
                <span className="hidden xl:inline md:inline">post</span>

                </a>
              </li>
              <li className={` ${!showTagged ? "md:border-t" : ""} cursor-pointer md:border-gray-700 md:-mt-px md:text-gray-700`}>
              <a
                  className="inline-block p-3"
                  onClick={(e) => { setShowTagged(false) }}
                >
                 <i className=" fas fa-th-large text-xl md:hidden xl:hidden lg:hidden">
                  <FontAwesomeIcon icon={faBookmark} className="text-xl" />
                </i>
                <span className="hidden xl:inline md:inline">tagged</span>

                </a>
              </li>
            </ul>

            {showTagged ?
              <div className="flex flex-wrap -mx-px md:-mx-3">
                  <Allblogs  setShowDelete= {(e)=>{handleShowDelete(e)}} />
              </div> : null}
            {!showTagged ?
              <div className="flex flex-wrap -mx-px md:-mx-3">  
                  <Tagged_post />
              </div> : null}

          </div>
        </div>
        </div>
      </main>
    {  editProfile? 
        <div className='whole_screen absolute left-0 w-screen top-0  w-screen  h-screen bg-transparent'>
        <div className="y_user_profile">
          <div className="centre_profile">
            <div className='profile_edit_1'>Change profile photo</div>
            <div className='profile_edit_2'>
              <label className="cursor-pointer" onChange={handleFileUpload}>
              Upload pic
              <input type="file" className="hidden"  />
            </label>
            </div>
            <div className='profile_edit_3 cursor-pointer' onClick={closing_edit}>Close</div>
          </div>
        </div>
      </div>: null
    }
    {showFollowers ? (
  <div className='followers_box' onClick={closingfollowers}>
    <div className='followers_main_box'>
      <div className='followers_second_main'>
        <div className='followers_logo'>
          <h3>Followers</h3>
          <FontAwesomeIcon onClick={closeFollowers} className='followers_close' icon={faTimes} />
        </div>
        <div className='followers_input'>
        <input
  type="text"
  placeholder="Search"
  value={filterFollowing}
  onChange={(e) => setFilterFollowing(e.target.value)}
/>
          </div>
        <div className='followers_append_list'>
        {filteredFollowing.length === 0 ? (
  followersInfo.length > 0 ? (
    followersInfo.map((follower) => (
      <div className='followers_user_top' key={follower.userId}>
        <div className='followers_user_dp'>
          <img
            src={
              follower.profilePic
                ? service.getFilePreview(follower.profilePic)
                : "https://cdn.icon-icons.com/icons2/2468/PNG/512/user_icon_149329.png"
            }
            alt=""
          />
          <div className='followers_user_name'>
            {follower.username}
          </div>
        </div>
        <div className='followers_user_delete'>
          <button onClick={() => removeFollower(follower.userId)}>remove</button>
        </div>
      </div>
    ))
  ) : (
    <div className="no-followers-message">
      <FontAwesomeIcon icon={faMeh} className="meh-icon" />
      No followers yet.
    </div>
  )
) : (
  filteredFollowing.map((follower) => (
    <div className='followers_user_top' key={follower.userId}>
      <div className='followers_user_dp'>
        <img
          src={
            follower.profilePic
              ? service.getFilePreview(follower.profilePic)
              : "https://cdn.icon-icons.com/icons2/2468/PNG/512/user_icon_149329.png"
          }
          alt=""
        />
        <div className='followers_user_name'>
          {follower.username}
        </div>
      </div>
      <div className='followers_user_delete'>
        <button onClick={() => removeFollower(follower.userId)} >remove</button>
      </div>
    </div>
  ))
)}

        </div>
      </div>
    </div>
  </div>
) : null}
   
   {showFollowing ? (
  <div className='followers_box' onClick={closingfollowing}>
    <div className='followers_main_box'>
      <div className='followers_second_main'>
        <div className='followers_logo'>
          <h3>Following</h3>
          <FontAwesomeIcon onClick={closeFollowing} className='followers_close' icon={faTimes} />
        </div>
        <div className='followers_input'><input type="text" placeholder='Search' 
        
          onChange={(e) => setFilterFollowing_mis(e.target.value)}    
        /></div>
        <div className='followers_append_list'>
        { filteredFollowing_mis.length == 0 ? 
          (followingInfo.length > 0 ? (
            followingInfo.map((follower) => (
              <div className='followers_user_top' key={follower.userId}>
                <div className='followers_user_dp' >
                  <img
                    src={
                      follower.profilePic
                        ? service.getFilePreview(follower.profilePic)
                        : "https://cdn.icon-icons.com/icons2/2468/PNG/512/user_icon_149329.png"
                    }
                    alt=""
                  />
                  <div className='followers_user_name'>
                    {follower.username}
                  </div>
                </div>
                <div className='followers_user_delete' onClick={() => removeFollowing(follower.userId)}> <button>remove</button></div>
              </div>
            ))
          ) : (
            <div className="no-following-message">
            <FontAwesomeIcon icon={faMeh} className="meh-icon" />
            User is not following anyone.
          </div>
          )) : (followingInfo.length > 0 ? (
            filteredFollowing_mis.map((follower) => (
              <div className='followers_user_top' key={follower.userId}>
                <div className='followers_user_dp' >
                  <img
                    src={
                      follower.profilePic
                        ? service.getFilePreview(follower.profilePic)
                        : "https://cdn.icon-icons.com/icons2/2468/PNG/512/user_icon_149329.png"
                    }
                    alt=""
                  />
                  <div className='followers_user_name'>
                    {follower.username}
                  </div>
                </div>
                <div className='followers_user_delete'> <button>remove</button></div>
              </div>
            ))
          ) : (
            <div className="no-following-message">
            <FontAwesomeIcon icon={faMeh} className="meh-icon" />
            User is not following anyone.
          </div>
          ))}
        </div>
      </div>
    </div>
  </div>
) : null}
   {showDelete ? (
 <div className='fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-50'>
 <div className='bg-gray-100 p-4 border rounded shadow-md'>
   <div className='text-center'>
     <p className='mb-4'>Are you sure you want to delete this post?</p>
     <div className='flex justify-center'>
       <button className='mr-2 bg-red-500 text-white px-4 py-2 rounded' onClick={deletePost}>
         Delete
       </button>
       <button className='bg-gray-300 px-4 py-2 rounded' onClick={closingShowDelete}>
         Cancel
       </button>
     </div>
   </div>
 </div>
</div>
   ): null}
    { loading? (    <div className="bg-white shadow p-8 rounded-md custom-margin">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Creating New Post</h2>
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-500"></div>
            </div>
            <p className="mt-4 text-gray-600">Please wait while we create your post.</p>
          </div>
        </div>) : null

    }
   

    </>
  );

}

export default Profile;
