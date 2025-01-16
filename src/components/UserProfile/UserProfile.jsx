import  { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import service from '../../appwrite/config';
import UserBlogs from './UserBlogs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { faMeh } from '@fortawesome/free-solid-svg-icons';
import { useMediaQuery } from '@react-hook/media-query';
import service2 from '../../appwrite/config2';
import { useSelector } from 'react-redux';

function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate()
  const userData = useSelector((state) => state.auth.userData);
  const [followersList, setFollowersList] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [followersnum, setFollowersnum] = useState(0);
  const [followingButton, setFollowingButton] = useState(false);
  const [profileInfo, setProfileInfo] = useState({});
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState('');
  const [followersInfo, setFollowersInfo] = useState([]);
  const [followingInfo, setFollowingInfo] = useState([]);
  const [showFollowers, setShowFollowers ] = useState(false);
  const [showFollowing, setShowFollowing ] = useState(false);
  const [sendMessage, setSendMessage ] = useState(false);
  const [posts, setPosts] = useState([]);
  const [following, setFollowing] = useState([]);
  const [showFollowingMessage, setShowFollowingMessage] = useState(false);
  const [showRemoveFollowingMessage, setShowRemoveFollowingMessage] = useState(false);
  const [userFollowingNum, setUserFollowingNum] = useState(null);
  const closeFollowers = ()=>{
  
    setShowFollowers((val)=> !val)
    
    document.querySelector("body").style.backgroundColor = "";
    document.querySelector(".hiddeeeen").style.filter = "blur(0px)";
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileResponse, userProfile,postsResponse] = await Promise.all([
          service.getProfileinfo(String(id)),
          service.getProfileinfo(String(userData?.$id)),
          service.getPostsForCurrentUser(id)
        ]);

        if (userProfile) {
          setFollowing(userProfile.followersList);
          setUserFollowingNum(userProfile.Following);
        }

        if (profileResponse) {
          setProfileInfo(profileResponse);
          setFollowersnum(profileResponse.Followers);

          if (profileResponse.followersList) {
            setFollowersList((prevFollowersList) => {
               prevFollowersList.includes(userData?.$id);
      
                setFollowingButton(true);
            
              return profileResponse.followersList; // Return the unchanged value
            });
          }
        }

        if (postsResponse) {
          setPosts(postsResponse.documents);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id, userData?.$id]); // Added userData?.$id as a dependency

  const followButton = async () => {
    try {
      const isFollowing = followersList.includes(userData?.$id);

      if (isFollowing) {
        const updatedFollowersList = followersList.filter((follower) => follower !== userData?.$id);
        setFollowersList(updatedFollowersList);
        setFollowing((data) => data.filter((item) => item !== userData?.$id));
        await service2.updateFollowers(id, {
          Followers: followersnum - 1,
          followersList: updatedFollowersList,
        });
        await service2.updateFollowing(userData?.$id, {
          Following: userFollowingNum - 1,
          followingList: following,
        });
        setUserFollowingNum((data) => data - 1);
        setFollowingButton(false);
        setFollowersnum((prevFollowersnum) => prevFollowersnum - 1);
        setShowRemoveFollowingMessage(true);
        setTimeout(() => {
          setShowRemoveFollowingMessage(false);
        }, 3000);
      } else {
        // Follow
        const updatedFollowersList = [...followersList, userData?.$id];
        setFollowersList(updatedFollowersList);
        const updatedFollowingList = [...following, id];
        setFollowing(updatedFollowingList);
        await service2.updateFollowers(id, {
          Followers: followersnum + 1,
          followersList: updatedFollowersList,
        });
        await service2.updateFollowing(userData?.$id, {
          Following: userFollowingNum + 1,
          followingList: updatedFollowingList,
        });
        setFollowingButton(true);
        setFollowersnum((prevFollowersnum) => prevFollowersnum + 1);
        setShowFollowingMessage(true);
        setTimeout(() => {
          setShowFollowingMessage(false);
        }, 3000);
      }
    } catch (error) {
      console.error("Error updating followers:", error);
    }
  };
  const viewfollowers = async () => {
    try {
      document.querySelector(".hiddeeeen").style.filter = "blur(3px)";
      setShowFollowers((val) => !val);
      const followers_list = profileInfo.followersList;
  
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
  setFollowingList
      setFollowersInfo(followersInfo);
    } catch (error) {
      console.error("Error fetching followers:", error);
      // Handle the error as needed
    }
  };
  const viewfollowing = async () => {
    try {
      document.querySelector(".hiddeeeen").style.filter = "blur(3px)";
      setShowFollowing((val) => !val);
      const followers_list = profileInfo.followingList;
  
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
  
      setFollowingInfo(followersInfo);
    } catch (error) {
      console.error("Error fetching followers:", error);
      // Handle the error as needed
    }
  };
  const closeFollowing = ()=>{
  
    setShowFollowing(false)
    
    document.querySelector("body").style.backgroundColor = "";
    document.querySelector(".hiddeeeen").style.filter = "blur(0px)";
  }

  const closeMessage  = () => {
      setSendMessage((val)=> !val)
      document.querySelector(".hiddeeeen").style.filter = "blur(0px)";
  };
  const isSmallScreen = useMediaQuery('(max-width: 768px)');
  const messageRandom = (id) => {
  
    if (isSmallScreen) {
      navigate(`/DeptMessage/${id}`);
    } else {
      document.querySelector(".hiddeeeen").style.filter = "blur(3px)";
      setSendMessage(true)
    }
  };
  const sendMessageToBackend = async () => {
    const senderID = `${userData.$id}`;
    const receiverID = id;

    const newMessage = {
      senderID,
      receiverID,
      messageContent: message,
      timestamp: new Date().toISOString(),
    };

    try {
      const a = await service.addMessage(newMessage);
      if (a) {
        setShowMessage(true)
        setInterval(() => {
          setShowMessage(false)
        }, 3000);
      }
      setMessage('');
      closeMessage()
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  return (
    <>
      <main className="hiddeeeen bg-gray-100 bg-opacity-25  max-w-custom">
        <div className="lg:w-8/12 lg:mx-auto mb-8">
        <div className="mb-4">
          {showMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">Messaged Send Successfully</span>
              <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
              
              </span>
            </div>
          )}
        </div>
        {showFollowingMessage && (
  <div className="bg-green-500  text-white p-2 rounded-md mt-4 max-w-xs mx-auto flex items-center justify-center" style={{ width: '11vw' }}>
    <div className="text-sm font-semibold">
      You are now following!
    </div>
  </div>
)}
        {showRemoveFollowingMessage && (
  <div className="bg-black text-white p-2 rounded-md mt-4 max-w-xs mx-auto flex items-center justify-center" style={{ width: '15vw' }}>
    <div className="text-sm font-semibold">
      You have unfollowed this user.
    </div>
  </div>
)}
          <header className="flex flex-wrap items-center p-4 md:py-8">

            <div className="md:w-3/12 md:ml-16">
              <img className="w-20 h-20 md:w-40 md:h-40 object-cover rounded-full
                      border-2 border-pink-600 p-1" src={profileInfo.ProfilePic ? service.getFilePreview(profileInfo.ProfilePic) : "https://cdn.icon-icons.com/icons2/2468/PNG/512/user_icon_149329.png"} alt="profile" />
            </div>

            <div className="w-8/12 md:w-7/12 ml-4">
              <div className="md:flex md:flex-wrap md:items-center mb-4">
                <h2 className="text-3xl inline-block font-light md:mr-2 mb-2 sm:mb-0">
                  {profileInfo.userName}
                </h2>

                <span className="inline-block fas fa-certificate fa-lg text-blue-500 
                                relative mr-6 text-xl transform -translate-y-2" aria-hidden="true">
                  <i className="fas fa-check text-white text-xs absolute inset-x-0
                                ml-1 mt-px"></i>
                </span>
                {followingButton ? (
                  <a
                    onClick={followButton}
                    className="bg-blue-500 px-2 py-1 text-white font-semibold text-sm rounded block text-center sm:inline-block block cursor-pointer"
                  >
                    Following
                  </a>
                ) : (
                  <a
                    onClick={followButton}
                    className="bg-blue-500 px-2 py-1 text-white font-semibold text-sm rounded block text-center sm:inline-block block cursor-pointer"
                  >
                    Follow
                  </a>
                )}
                  <a style={{background:"#efefef", color:"black",fontWeight:"400",marginLeft:"10px"}}
                    className="bg-grey-500 px-2 py-1 text-white font-semibold text-sm rounded block text-center sm:inline-block block cursor-pointer mt-2"
                    onClick={() => messageRandom(id)}
                  >
                    Message
                  </a>
              </div>

              <ul className="hidden md:flex space-x-8 mb-4">
                <li>
                  <span className="font-semibold">{posts ? posts.length : 0} </span>
                  posts
                </li>

                <li onClick={viewfollowers} style={{cursor: "pointer"}} >
                  <span className="font-semibold">{followersnum ? followersnum : 0} </span>
                  followers
                </li>
                <li onClick={viewfollowing} style={{cursor: "pointer"}} >
                  <span className="font-semibold"  >{profileInfo ? profileInfo.Following : 0} </span>
                  following
                </li>
              </ul>
            {profileInfo.Bio ? profileInfo.Bio :
              <div className="hidden md:block">
                <h1 className="font-semibold"></h1>
              </div>}
            </div>

            <div className="md:hidden text-sm my-2">
              {/* <h1 className="font-semibold">Mr Travlerrr...</h1>
              <span>Travel, Nature and Music</span>
              <p>Lorem ipsum dolor sit amet consectetur</p> */}
            </div>

          </header>

          <div className="px-px md:px-3">

            <ul className="flex md:hidden justify-around space-x-8 border-t 
                  text-center p-2 text-gray-600 leading-snug text-sm">
              <li>
                <span className="font-semibold text-gray-800 block">{posts ? posts.length : 0}</span>
                posts
              </li>

              <li onClick={viewfollowers}>
                <span className="font-semibold text-gray-800 block">{profileInfo.Followers ? profileInfo.Followers : 0}</span>
                followers
              </li>
              <li onClick={viewfollowing} >
                <span className="font-semibold text-gray-800 block"  >{profileInfo.Following ? profileInfo.Following : 0}</span>
                following
              </li>
            </ul>

            <ul className="flex items-center justify-around md:justify-center space-x-12  
                      uppercase tracking-widest font-semibold text-xs text-gray-600
                      border-t">
              <li className={`md:border-t cursor-pointer md:border-gray-700 md:-mt-px md:text-gray-700`}>
                <a
                  className="inline-block p-3"
                >
                  <i className="fas fa-th-large text-xl md:text-xs"></i>
                  <span className="hidden md:inline">post</span>
                </a>
              </li>
              
            </ul>

              <div className="flex flex-wrap -mx-px md:-mx-3">
                  <UserBlogs id={id} />
              </div>

          </div>
        </div>
      </main>
      {showFollowers ? (
  <div className='followers_box'   >
    <div className='followers_main_box'>
      <div className='followers_second_main'>
        <div className='followers_logo'>
          <h3>Followers</h3>
          <FontAwesomeIcon onClick={closeFollowers} className='followers_close cursor-pointer' icon={faTimes} />
        </div>
        <div className='followers_input'>
      
          </div>
        <div className='followers_append_list'>
        { followersList.length>0?
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
              </div>
            ))
        : (
          <div className="no-followers-message">
            <FontAwesomeIcon icon={faMeh} className="meh-icon cursor-pointer" />
            No followers yet.
          </div>
        )

        }
       
    </div>
    </div>
    </div>
    </div>
    )
: null }
      {showFollowing ? (
  <div className='followers_box'   >
    <div className='followers_main_box'>
      <div className='followers_second_main'>
        <div className='followers_logo'>
          <h3>Following</h3>
          <FontAwesomeIcon onClick={closeFollowing} className='followers_close cursor-pointer' icon={faTimes} />
        </div>
        <div className='followers_input'>
      
          </div>
        <div className='followers_append_list'>
        { followingList.length>0?
             followingInfo.map((follower) => (
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
              </div>
            ))
        : (
          <div className="no-followers-message">
            <FontAwesomeIcon  icon={faMeh} className="meh-icon cursor-pointer" />
            No followers yet.
          </div>
        )

        }
       
    </div>
    </div>
    </div>
    </div>
    )
: null }
  {sendMessage ? (
  <div style={{ height: '100vh', width: '85vw', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'absolute', top: '0', right: '0' }}>
    <div className='message-box sm:w-76vw sm:h-36vh' style={{ width: '30vw', height: '40vh', backgroundColor: 'white', position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', borderRadius: '8px', overflow: 'hidden' }} >

      <div className='message-main-box'>
        <div className='message-header' style={{ backgroundColor: '#3498db', color: 'white', padding: '1rem', borderBottom: '1px solid #2980b9', borderTopLeftRadius: '8px', borderTopRightRadius: '8px',justifyContent: "space-between" , display:"flex" }}>
          <h3>Send a Message</h3>
          <span className='close-button' onClick={closeMessage} style={{ cursor: 'pointer' }}>
            <FontAwesomeIcon icon={faTimes} />
          </span>
        </div>
        <div className='message-body' style={{ padding: '1rem' }}>
        <textarea
            placeholder='Type your message...'
            rows='3'
            className='message-input rounded-md p-2 border border-gray-300 focus:outline-none w-full'
            value={message}
            onChange={(e) => setMessage(e.target.value)} // Update the 'message' state on input change
          />
          <button className='send-button bg-blue-500 text-white px-4 py-2 rounded-md mt-2 hover:bg-blue-700 transition duration-300' onClick={sendMessageToBackend} >
            Send
          </button>
        </div>
      </div>
    </div>
  </div>
) : null}

 

    </>
  );
}

export default UserProfile;
